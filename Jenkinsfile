pipeline {
    agent any

    options {
    skipDefaultCheckout(true)
    disableConcurrentBuilds()
    timestamps()
}

    environment {
        AWS_REGION       = 'ap-northeast-2'
        S3_BUCKET        = 'rimo-web-deploy-110844250782'
        WEB_INSTANCE_ID  = 'i-0effe371ad87bbf66'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                      -u "$(id -u):$(id -g)" \
                      -e HOME=/tmp \
                      -v "$WORKSPACE:/app" \
                      -w /app \
                      node:22-alpine \
                      sh -c 'npm ci && npm run build'

                    test -f dist/index.html
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                sh '''
                    set -eu

                    aws s3 sync dist/ \
                      "s3://${S3_BUCKET}/" \
                      --delete \
                      --region "${AWS_REGION}"
                '''
            }
        }

        stage('Deploy to Web EC2') {
            steps {
                script {
                    def commandId = sh(
                        script: '''
                            aws ssm send-command \
                              --instance-ids "${WEB_INSTANCE_ID}" \
                              --document-name "AWS-RunShellScript" \
                              --parameters "commands=[\\"set -e\\",\\"aws s3 sync s3://${S3_BUCKET}/ /usr/share/nginx/html/ --delete --region ${AWS_REGION}\\",\\"chown -R nginx:nginx /usr/share/nginx/html\\",\\"nginx -t\\",\\"systemctl restart nginx\\",\\"curl -fsS http://localhost/ > /dev/null\\"]" \
                              --region "${AWS_REGION}" \
                              --query 'Command.CommandId' \
                              --output text
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "SSM Command ID: ${commandId}"

                    timeout(time: 10, unit: 'MINUTES') {
                        waitUntil {
                            def status = sh(
                                script: """
                                    aws ssm get-command-invocation \
                                      --command-id "${commandId}" \
                                      --instance-id "${WEB_INSTANCE_ID}" \
                                      --region "${AWS_REGION}" \
                                      --query 'Status' \
                                      --output text 2>/dev/null || echo Pending
                                """,
                                returnStdout: true
                            ).trim()

                            echo "Deployment status: ${status}"

                            if (status == 'Success') {
                                sh """
                                    aws ssm get-command-invocation \
                                      --command-id "${commandId}" \
                                      --instance-id "${WEB_INSTANCE_ID}" \
                                      --region "${AWS_REGION}" \
                                      --query '[Status,StandardOutputContent,StandardErrorContent]' \
                                      --output text
                                """

                                return true
                            }

                            if (status in ['Failed', 'Cancelled', 'TimedOut', 'Cancelling']) {
                                sh """
                                    aws ssm get-command-invocation \
                                      --command-id "${commandId}" \
                                      --instance-id "${WEB_INSTANCE_ID}" \
                                      --region "${AWS_REGION}"
                                """

                                error("Web deployment failed: ${status}")
                            }

                            sleep 5
                            return false
                        }
                    }
                }
            }
        }

        stage('Verify Public Web') {
            steps {
                sh '''
                    curl -fsS https://www.rimo-app.com/ > /dev/null
                    echo "https://www.rimo-app.com is responding successfully."
                '''
            }
        }
    }

    post {
        success {
            echo 'RIMO web deployment succeeded.'
        }

        failure {
            echo 'RIMO web deployment failed.'
        }
    }
}