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

                    EXPECTED_JS=$(grep -oE 'assets/index-[A-Za-z0-9_-]+[.]js' dist/index.html | head -n 1)

                    test -n "${EXPECTED_JS}"
                    test -f "dist/${EXPECTED_JS}"

                    echo "Build index.html references: ${EXPECTED_JS}"

                    aws s3 sync dist/ \
                      "s3://${S3_BUCKET}/" \
                      --delete \
                      --region "${AWS_REGION}"

                    echo "Verifying S3 build set..."

                    aws s3 cp \
                      "s3://${S3_BUCKET}/index.html" - \
                      --region "${AWS_REGION}" \
                      | grep -F "${EXPECTED_JS}" > /dev/null

                    aws s3api head-object \
                      --bucket "${S3_BUCKET}" \
                      --key "${EXPECTED_JS}" \
                      --region "${AWS_REGION}" \
                      > /dev/null

                    echo "S3 build set verification succeeded."
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
                              --parameters "commands=[\\"set -e\\",\\"rm -rf /usr/share/nginx/html.next /usr/share/nginx/html.old\\",\\"mkdir -p /usr/share/nginx/html.next\\",\\"aws s3 sync s3://${S3_BUCKET}/ /usr/share/nginx/html.next/ --delete --region ${AWS_REGION}\\",\\"test -f /usr/share/nginx/html.next/index.html\\",\\"grep -qE 'assets/index-[A-Za-z0-9_-]+[.]js' /usr/share/nginx/html.next/index.html\\",\\"grep -oE 'assets/index-[A-Za-z0-9_-]+[.]js' /usr/share/nginx/html.next/index.html | xargs -I{} test -f /usr/share/nginx/html.next/{}\\",\\"echo Staged_build_verification_succeeded\\",\\"chown -R nginx:nginx /usr/share/nginx/html.next\\",\\"nginx -t\\",\\"mv /usr/share/nginx/html /usr/share/nginx/html.old\\",\\"if mv /usr/share/nginx/html.next /usr/share/nginx/html; then true; else mv /usr/share/nginx/html.old /usr/share/nginx/html; exit 1; fi\\",\\"systemctl restart nginx\\",\\"if curl -fsS http://localhost/index.html -o /tmp/rimo-index.html && grep -qE 'assets/index-[A-Za-z0-9_-]+[.]js' /tmp/rimo-index.html && grep -oE 'assets/index-[A-Za-z0-9_-]+[.]js' /tmp/rimo-index.html | xargs -I{} test -f /usr/share/nginx/html/{}; then rm -rf /usr/share/nginx/html.old /tmp/rimo-index.html; echo Local_web_verification_succeeded; else rm -rf /usr/share/nginx/html; mv /usr/share/nginx/html.old /usr/share/nginx/html; systemctl restart nginx; exit 1; fi\\"]" \
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
                    set -eu

                    EXPECTED_JS=$(grep -oE 'assets/index-[A-Za-z0-9_-]+[.]js' dist/index.html | head -n 1)

                    test -n "${EXPECTED_JS}"

                    echo "Expected public JS: ${EXPECTED_JS}"

                    curl -fsS \
                      "https://www.rimo-app.com/index.html?build=${BUILD_NUMBER}" \
                      -o /tmp/rimo-public-index.html

                    grep -F "${EXPECTED_JS}" \
                      /tmp/rimo-public-index.html \
                      > /dev/null

                    CONTENT_TYPE=$(curl -fsSI \
                      "https://www.rimo-app.com/${EXPECTED_JS}?build=${BUILD_NUMBER}" \
                      | tr -d '\\r' \
                      | awk -F': ' 'tolower($1)=="content-type" {print tolower($2)}')

                    echo "Public JS content-type: ${CONTENT_TYPE}"

                    echo "${CONTENT_TYPE}" \
                      | grep -E 'javascript|ecmascript' \
                      > /dev/null

                    echo "Public web is serving the latest build: ${EXPECTED_JS}"
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