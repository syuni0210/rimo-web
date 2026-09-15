import React, { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import rimoLogo from "./assets/rimo-logo.png";
import rimoQr from "./assets/rimo-qr.png";
import rimoHomeReal from "./assets/rimo-home-real.png";

const features = [
  {
    id: "route",
    no: "01",
    title: "안심경로",
    tag: "AI SAFE ROUTE",
    summary: "현재 위치에서 목적지를 검색한 뒤 빠른길·AI 안전경로·대로변을 비교하고, 선택한 경로로 귀가 안내를 시작합니다.",
    points: ["목적지 검색 → 경로 비교", "AI 추천 이유 확인", "귀가 진행 중 연속 경로 안내"],
  },
  {
    id: "friend",
    no: "02",
    title: "안심친구",
    tag: "LIVE LOCATION",
    summary: "안심친구와 필요한 순간 위치를 공유하고, 친구의 현재 위치를 지도에서 확인할 수 있습니다.",
    points: ["위치 공유 ON/OFF", "친구 현재 위치 확인", "이상 상황 알림 연결"],
  },
  {
    id: "map",
    no: "03",
    title: "안심지도",
    tag: "SAFETY MAP",
    summary: "현재 위치 주변의 CCTV·보안등·비상벨 등 공공 안전시설을 필요한 종류만 골라 확인합니다.",
    points: ["안전시설 한 종류씩 선택", "현재 위치 중심 탐색", "주변 안전 인프라 확인"],
  },
  {
    id: "siren",
    no: "04",
    title: "꽥꽥이",
    tag: "SIREN",
    summary: "긴급한 순간 경고음과 플래시를 즉시 작동시켜 주변에 위험 상황을 알리는 보조 기능입니다.",
    points: ["경고음", "플래시", "즉시 실행·중지"],
  },
  {
    id: "report",
    no: "05",
    title: "사용 리포트",
    tag: "MY REPORT",
    summary: "대시보드에서는 귀가 요약을 보고, 기록 탭에서는 달력에서 날짜를 눌러 해당 날짜의 귀가 상세를 확인합니다.",
    points: ["귀가 요약 대시보드", "달력에서 날짜 선택", "선택 날짜 귀가 상세 확인"],
  },
  {
    id: "emergency",
    no: "06",
    title: "긴급신고",
    tag: "EMERGENCY",
    summary: "긴급 상황에서 등록된 보호자에게 현재 위치와 위치 확인 링크를 빠르게 전달합니다.",
    points: ["보호자 알림", "현재 위치 전달", "지도 링크 제공"],
  },
];

const usage = [
  { no: "01", title: "목적지 설정", desc: "현재 위치를 기준으로 목적지를 검색하거나 기본 목적지를 선택합니다." },
  { no: "02", title: "경로 비교", desc: "빠른길·AI 안전경로·대로변을 비교하고 추천 이유까지 확인합니다." },
  { no: "03", title: "안심 귀가 시작", desc: "선택한 경로로 귀가 안내를 시작하고 이동 상태를 확인합니다." },
];

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    pin: <><path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.7 7.9 7 10 4.3-2.1 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></>,
    alert: <><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.7 2.5 17.2A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z"/></>,
    play: <path d="m8 5 11 7-11 7V5Z"/>,
    back: <path d="m15 18-6-6 6-6"/>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    camera: <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></>,
    light: <><circle cx="12" cy="10" r="4"/><path d="M12 2v2M4.9 4.9l1.4 1.4M2 12h2M20 12h2M17.7 6.3l1.4-1.4M9 16h6M10 20h4"/></>,
    speaker: <><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a8.5 8.5 0 0 1 0 12"/></>,
    bolt: <path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z"/>,
  };
  return <svg {...common}>{paths[name] || paths.check}</svg>;
}

function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function PhoneShell({ children, className = "" }) {
  return <div className={`device ${className}`.trim()}><div className="device-screen">{children}</div></div>;
}

function MiniMap({ variant = "route", activeFilter = "cctv" }) {
  const show = (x) => activeFilter === x;
  return (
    <div className={`mini-map mini-map-${variant}`}>
      <span className="road r1"/><span className="road r2"/><span className="road r3"/><span className="road r4"/><span className="road r5"/>
      {variant === "route" && <>
        <svg className="route-svg" viewBox="0 0 300 320" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="rimoRouteGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5f7df8"/><stop offset="1" stopColor="#7a65f3"/></linearGradient></defs>
          <path className="route-halo" d="M54 270 C80 245 82 218 116 198 C145 181 160 174 170 145 C180 116 196 104 220 92 C240 82 248 66 254 48"/>
          <path className="route-path" d="M54 270 C80 245 82 218 116 198 C145 181 160 174 170 145 C180 116 196 104 220 92 C240 82 248 66 254 48"/>
        </svg>
        <span className="start-dot"/><span className="dest-pin"><Icon name="pin" size={16}/></span>
        <span className="route-place place-a">인사동</span><span className="route-place place-b">종각역</span>
      </>}
      {variant === "search" && <>
        <span className="search-current-dot"/><span className="search-current-label">김리모</span>
        <span className="map-poi p1">인사동</span><span className="map-poi p2">종로</span><span className="map-poi p3">탑골공원</span>
      </>}
      {variant === "friend" && <><span className="friend-path"/><div className="map-person person-me"><b>김리모</b><small>이동 중</small></div><div className="map-person person-friend"><b>시윤이</b><small>근처에 있어요</small></div></>}
      {variant === "safety" && <>
        {show("cctv") && ["m1","m4","m7","m10","m3","m8"].map(x => <span key={x} className={`facility-marker cctv ${x}`}><Icon name="camera" size={12}/></span>)}
        {show("streetlight") && ["m2","m6","m9","m5"].map(x => <span key={x} className={`facility-marker streetlight ${x}`}><Icon name="light" size={12}/></span>)}
        {show("safehouse") && ["m1","m5","m9"].map(x => <span key={x} className={`facility-marker safehouse ${x}`}><Icon name="home" size={12}/></span>)}
        {show("police") && ["m2","m7","m10"].map(x => <span key={x} className={`facility-marker police ${x}`}><Icon name="shield" size={12}/></span>)}
        {show("bell") && ["m3","m6","m8"].map(x => <span key={x} className={`facility-marker bell ${x}`}><Icon name="bell" size={12}/></span>)}
        {show("securitylight") && ["m1","m4","m6","m10"].map(x => <span key={x} className={`facility-marker securitylight ${x}`}><Icon name="light" size={12}/></span>)}
        <span className="my-location"/>
      </>}
    </div>
  );
}

function HomeMockup({ onFeature }) {
  return (
    <div className="app-screen home-ui">
      <div className="app-brand"><img src={rimoLogo} alt=""/><span>Rimo</span></div>
      <div className="hello"><small>오늘도 안전한 귀가를 위해</small><h3><b>김리모</b>님, 안녕하세요.</h3></div>
      <button className="home-route-card" onClick={() => onFeature("route")}>
        <div><span>AI 안전경로</span><strong>안심되는 길을 찾아볼까요?</strong><small>목적지를 입력하고 경로를 비교해보세요.</small></div>
        <span className="round-icon"><Icon name="pin"/></span>
      </button>
      <p className="app-label">주요 기능</p>
      <div className="home-grid">
        <button onClick={() => onFeature("friend")}><Icon name="people"/><span>안심친구</span></button>
        <button onClick={() => onFeature("map")}><Icon name="map"/><span>안심지도</span></button>
        <button onClick={() => onFeature("siren")}><Icon name="bell"/><span>꽥꽥이</span></button>
        <button onClick={() => onFeature("report")}><Icon name="chart"/><span>리포트</span></button>
      </div>
      <button className="home-emergency" onClick={() => onFeature("emergency")}><Icon name="alert" size={17}/><span>긴급신고</span></button>
      <div className="tap-hint">기능을 눌러보세요</div>
    </div>
  );
}

function RouteMockup() {
  const [stage, setStage] = useState("search");
  const [selected, setSelected] = useState("safe");
  const [reason, setReason] = useState(false);
  const [query, setQuery] = useState("");
  const routes = {
    fast: { title: "빠른길", distance: "534m", time: "7분", detail: "가장 빠른 경로" },
    safe: { title: "AI 안전경로", distance: "534m", time: "8분", detail: "안전 점수 19.7점" },
    main: { title: "대로변", distance: "610m", time: "9분", detail: "넓은 길을 우선" },
  };

  if (stage === "search") return (
    <div className="app-screen route-search-ui">
      <div className="app-top"><button type="button"><Icon name="back"/></button><strong>안심경로</strong><span/></div>
      <div className="route-search-box">
        <div className="search-row fixed"><span className="search-icon-dot"><Icon name="pin" size={18}/></span><div><small>출발지</small><b>서울특별시 종로구 인사동 43</b></div></div>
        <label className="search-row destination"><span className="search-icon-dot"><Icon name="map" size={18}/></span><div><small>도착지</small><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter" && query.trim()) setStage("select")}} placeholder="목적지를 검색하세요" /></div></label>
      </div>
      <div className="quick-destination"><strong>기본 목적지</strong><button type="button" onClick={()=>{setQuery("종각역 1호선");setStage("select")}}><Icon name="home" size={18}/>지하철</button></div>
      <div className="route-search-map full"><MiniMap variant="search"/></div>
      <div className="tap-hint">목적지를 검색하거나 기본 목적지를 선택해보세요</div>
    </div>
  );

  if (stage === "active") return (
    <div className="app-screen route-active-ui">
      <div className="app-top"><button type="button" onClick={() => setStage("select")}><Icon name="back"/></button><strong>귀가 진행 중</strong><span/></div>
      <div className="trip-stat"><div><small>예상 도착 시간</small><b>12:27</b></div><div><small>남은 거리</small><b>502m</b></div><div><small>남은 시간</small><b>8분</b></div></div>
      <div className="share-status"><span>위치 공유</span><b>ON</b><span className="share-target"><Icon name="people" size={17}/>공유 대상 1명</span></div>
      <MiniMap variant="route"/>
      <div className="active-route-progress"><div><small>현재 경로 · {routes[selected].title}</small><div className="progress-line"><i/></div><span><em>출발</em><b>6%</b><em>도착</em></span></div></div>
      <button type="button" className="outline-app-btn" onClick={() => setStage("select")}>안내 종료</button>
    </div>
  );

  return (
    <div className="app-screen route-ui">
      <div className="app-top"><button type="button" onClick={() => setStage("search")}><Icon name="back"/></button><strong>경로 선택</strong><span className="tiny-info">i</span></div>
      <div className="route-address"><div><span>출발지</span><b>서울특별시 종로구 인사동길 12</b></div><div><span>도착지</span><b>{query || "종각역 1호선"}</b></div></div>
      <div className="route-options">
        <button type="button" onClick={() => {setSelected("fast");setStage("active")}}><div><b>빠른길</b></div><strong>534m <small>예상 8분</small></strong><span>가장 짧은 거리의 도보 경로</span></button>
        <button type="button" className="selected" onClick={() => {setSelected("safe");setStage("active")}}><div><b>AI 안전경로 ✨</b></div><strong>534m <small>예상 8분</small> <em className="safety-score">안전 19.7점</em></strong><span>보안등 32개 · CCTV 4개 · 비상벨 0개</span><span>실제 안전시설 데이터와 AI 분석을 반영한 추천 경로</span><a onClick={(e) => { e.stopPropagation(); setReason(true); }}>왜 이 경로를 추천했나요? ›</a></button>
        <button type="button" onClick={() => {setSelected("main");setStage("active")}}><div><b>대로변</b></div><strong>610m <small>예상 9분</small></strong><span>넓은 길을 우선하는 도보 경로</span></button>
      </div>
      <p className="route-select-note">경로를 선택하면 안내가 시작됩니다.</p>
      <AnimatePresence>{reason && <motion.div className="app-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setReason(false)}><motion.div className="app-modal" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:15,opacity:0}} onClick={(e)=>e.stopPropagation()}><h4>AI 추천 이유</h4><p>보안등 32개, CCTV 4개, 비상벨 0개 등 실제 안전시설 데이터와 AI 분석을 반영해 안전점수를 계산했어요.</p><div className="score-row"><span>안전점수</span><b>19.7점</b></div><button type="button" onClick={() => setReason(false)}>확인</button></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}

function FriendMockup() {
  const [sharing, setSharing] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  if (mapOpen) return <div className="app-screen friend-map-ui"><div className="app-top"><button onClick={() => setMapOpen(false)}><Icon name="back"/></button><strong>시윤이의 위치</strong><span/></div><div className="location-banner"><Icon name="pin" size={14}/><div><small>현재 위치</small><b>서울 종로구 인사동길 31</b></div></div><MiniMap variant="friend"/><div className="friend-map-card"><div className="avatar">시</div><div><b>시윤이</b><span>지금, 근처에 있어요</span></div><span className="online-dot"/></div></div>;
  return <div className="app-screen friend-ui"><div className="app-top"><span/><strong>안심친구</strong><span/></div><p className="app-intro">안심친구와 함께하면 더욱 안전해요.<br/>위치 공유와 상황 알림을 주고받을 수 있어요.</p><button className="add-friend">＋ 친구 추가</button><div className="list-title"><b>안심친구 목록</b><span>1 / 50</span></div><div className="friend-card"><div className="avatar">시</div><div className="friend-main"><b>시윤이</b><span>@siyoon</span></div><button className="pin-button" onClick={() => setMapOpen(true)}><Icon name="pin" size={17}/><small>위치</small></button><div className="share-row"><span><Icon name="pin" size={13}/> 위치 공유</span><button aria-label="위치 공유 토글" onClick={() => setSharing(!sharing)} className={`toggle ${sharing ? "on" : ""}`}><i/></button><small>{sharing ? "ON" : "OFF"}</small></div></div><div className="me-card"><span>내 프로필</span><b>김리모</b><small>{sharing ? "시윤이에게 위치 공유 중" : "위치 공유 꺼짐"}</small></div><div className="tap-hint">위치 공유와 친구 위치를 확인해보세요</div></div>;
}

function SafetyMapMockup() {
  const [filter, setFilter] = useState("cctv");
  const data = [
    {id:"cctv",label:"CCTV",icon:"camera"},
    {id:"streetlight",label:"가로등",icon:"light"},
    {id:"safehouse",label:"지킴이집",icon:"home"},
    {id:"police",label:"지구대",icon:"shield"},
    {id:"bell",label:"비상벨",icon:"bell"},
    {id:"securitylight",label:"보안등",icon:"light"},
  ];
  return <div className="app-screen safety-map-ui">
    <div className="app-top"><button type="button"><Icon name="back"/></button><strong>안심지도</strong><span/></div>
    <div className="location-search"><Icon name="pin" size={17}/><b>현재 위치</b><span>대일빌딩</span></div>
    <MiniMap variant="safety" activeFilter={filter}/>
    <div className="facility-sheet">
      <div className="sheet-title"><span>지도에 표시할 항목을 선택해주세요</span></div>
      <div className="facility-grid">{data.map(x=><button type="button" aria-pressed={filter===x.id} key={x.id} className={filter===x.id?"on":""} onClick={()=>setFilter(x.id)}><Icon name={x.icon}/><b>{x.label}</b></button>)}</div>
    </div>
  </div>;
}

function SirenMockup() {
  return <div className="app-screen siren-ui active">
    <div className="siren-title"><span>‹</span><strong>꽥꽥이</strong><span/></div>
    <div className="siren-core" aria-hidden="true"><span className="wave w1"/><span className="wave w2"/><Icon name="bell" size={58}/><i/></div>
    <h3>꽥꽥이 작동 중</h3>
    <p>경고음과 플래시가 자동으로 작동됩니다.<br/>사용자가 등록한 보호자에게<br/>문자가 전송되지 않습니다.</p>
    <div className="siren-controls">
      <div className="siren-status-card"><span className="status-icon"><Icon name="speaker" size={25}/></span><div><b>경고음</b><small>작동 중</small></div><i className="status-check">✓</i></div>
      <div className="siren-status-card"><span className="status-icon"><Icon name="bolt" size={25}/></span><div><b>플래시</b><small>작동 중</small></div><i className="status-check">✓</i></div>
    </div>
    <button type="button" className="siren-stop"><span>■</span><div><b>중지하기</b><small>꽥꽥이 즉시 중지</small></div></button>
  </div>;
}

function ReportMockup() {
  const [tab, setTab] = useState("dash");
  const [selectedDay, setSelectedDay] = useState(9);
  const records = {
    5:{from:"광화문광장",to:"인사동길 12",start:"21:08",end:"21:24",duration:"16분",route:"AI 안전경로"},
    8:{from:"종로3가역",to:"인사동길 12",start:"22:11",end:"22:20",duration:"9분",route:"빠른길"},
    9:{from:"서울특별시 종로구 인사동길 12",to:"종각역 1호선",start:"10:07",end:"10:12",duration:"5분",route:"AI 안전경로"},
  };
  const record = records[selectedDay];
  const days = [null,null,...Array.from({length:30},(_,i)=>i+1)];
  return <div className="app-screen report-ui"><div className="app-top"><span/><strong>사용 리포트</strong><span/></div><div className="report-tabs"><button type="button" onClick={()=>setTab("dash")} className={tab==="dash"?"on":""}>대시보드</button><button type="button" onClick={()=>setTab("history")} className={tab==="history"?"on":""}>기록</button></div>{tab==="dash" ? <><h4>귀가 요약</h4><div className="summary-cards"><div><Icon name="home"/><small>총 귀가 횟수</small><b>4<em>회</em></b></div><div><Icon name="chart"/><small>평균 소요시간</small><b>12<em>분</em></b></div></div><h4>경로 선호도</h4><div className="donut-wrap"><div className="donut"><span>AI<br/>50%</span></div><ul><li><i className="blue"/>빠른길 <b>25%</b></li><li><i className="purple"/>AI 안전경로 <b>50%</b></li><li><i className="gray"/>대로변 <b>25%</b></li></ul></div><div className="best-friend"><div className="avatar">시</div><div><small>앱을 가장 많이 사용한 친구</small><b>시윤이</b><span>이번 주 2회</span></div></div></> : <div className="calendar-view"><div className="calendar-card"><div className="calendar-head"><button type="button">‹</button><b>2026년 9월</b><button type="button">›</button></div><div className="weekday-row">{["일","월","화","수","목","금","토"].map(x=><span key={x}>{x}</span>)}</div><div className="calendar-grid">{days.map((day,i)=>day===null?<span key={`blank-${i}`}/>:<button type="button" key={day} className={`${selectedDay===day?"selected":""} ${records[day]?"has-record":""}`} onClick={()=>setSelectedDay(day)}><b>{day}</b>{records[day]&&<i/>}</button>)}</div></div><div className="record-detail"><h4>2026.9.{selectedDay} 귀가 기록</h4>{record ? <div className="record-table"><div><span>출발지</span><b>{record.from}</b></div><div><span>도착지</span><b>{record.to}</b></div><div><span>출발시간</span><b>{record.start}</b></div><div><span>도착시간</span><b>{record.end}</b></div><div><span>소요시간</span><b>{record.duration}</b></div><div><span>선택 경로</span><b>{record.route}</b></div></div> : <p className="no-record">이 날짜에는 귀가 기록이 없어요.</p>}</div></div>}<div className="tap-hint">날짜를 선택해 귀가 기록을 확인해보세요</div></div>;
}

function EmergencyMockup() {
  const [stage, setStage] = useState("idle");
  return <div className="app-screen emergency-ui"><div className="app-top"><span/><strong>긴급신고</strong><span/></div><div className="emergency-symbol"><Icon name="alert" size={50}/></div><h3>{stage === "sent" ? "보호자에게 알렸어요" : "긴급한 상황인가요?"}</h3><p>{stage === "sent" ? "등록된 보호자에게 현재 위치와\n위치 확인 링크를 전송했습니다." : "신고를 누르면 등록된 보호자에게\n현재 위치가 전달됩니다."}</p>{stage === "sent" ? <div className="sent-card"><div><span>전송 대상</span><b>시윤이</b></div><div><span>현재 위치</span><b>서울 종로구 인사동길 31</b></div><div><span>포함 정보</span><b>현재 주소 · 지도 링크</b></div></div> : <button className="emergency-main" onClick={()=>setStage("confirm")}>긴급신고</button>} {stage === "sent" && <button className="emergency-reset" onClick={()=>setStage("idle")}>처음으로</button>}<AnimatePresence>{stage === "confirm" && <motion.div className="app-modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="app-modal emergency-modal" initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}}><div className="warning-round"><Icon name="alert"/></div><h4>긴급신고를 보낼까요?</h4><p>시윤이에게 현재 위치와 지도 링크가 전달됩니다.</p><div className="modal-actions"><button onClick={()=>setStage("idle")}>취소</button><button onClick={()=>setStage("sent")}>전송</button></div></motion.div></motion.div>}</AnimatePresence><div className="tap-hint">긴급신고 과정을 확인해보세요</div></div>;
}

function FeaturePhone({ id }) {
  const components = { route: <RouteMockup/>, friend: <FriendMockup/>, map: <SafetyMapMockup/>, siren: <SirenMockup/>, report: <ReportMockup/>, emergency: <EmergencyMockup/> };
  return <PhoneShell className="feature-phone">{components[id]}</PhoneShell>;
}

export default function App() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  const feature = features[activeFeature];

  const selectFeatureById = (id, scroll = true) => {
    const i = features.findIndex(f => f.id === id);
    if (i >= 0) setActiveFeature(i);
    if (scroll) setTimeout(() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  return <div className="site">
    <motion.div className="scroll-progress" style={{ scaleX: progress }}/>
    <header className="header"><div className="shell header-inner"><a href="#top" className="brand"><img src={rimoLogo} alt="RIMO 로고"/><b>RIMO</b></a><nav><a href="#about">서비스 소개</a><a href="#features">주요 기능</a><a href="#howto">사용법</a><a href="#demo">시연 영상</a></nav><a href="#download" className="header-cta">앱 다운로드</a></div></header>

    <main id="top">
      <section className="hero shell">
        <div className="hero-copy">
          <motion.span className="eyebrow" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>AI 기반 안전 귀가 서비스</motion.span>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.08}}>늦은 귀갓길,<br/><em>더 안심할 수 있게.</em></motion.h1>
          <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.18}}>RIMO는 AI 안전경로 추천부터 안심친구 위치 공유, 이상 상황 확인과 보호자 알림까지 귀가 과정을 하나로 연결합니다.</motion.p>
          <motion.div className="hero-actions" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.28}}><a href="#download" className="primary-btn">QR로 앱 받기 <Icon name="arrow" size={16}/></a><a href="#features" className="secondary-btn">기능 체험하기</a></motion.div>
          <div className="hero-points"><span><Icon name="check" size={12}/>AI 안전경로</span><span><Icon name="check" size={12}/>실시간 위치 공유</span><span><Icon name="check" size={12}/>보호자 알림</span></div>
        </div>
        <motion.div className="hero-device-wrap" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.1}}><div className="hero-glow"/><PhoneShell className="hero-phone hero-real-phone"><div className="hero-real-shot"><img src={rimoHomeReal} alt="RIMO 홈 화면"/></div></PhoneShell></motion.div>
      </section>

      <section id="about" className="section shell about-section">
        <Reveal className="about-copy"><span className="section-kicker">WHY RIMO</span><h2>가장 빠른 길보다,<br/>더 안심할 수 있는 길.</h2><p>기존 길찾기의 거리·시간 기준에 보행 안전 데이터를 더하고, 귀가 중에는 안심친구와 연결되어 이상 상황까지 단계적으로 확인합니다.</p></Reveal>
        <div className="value-list">
          <Reveal delay={.03}><article><span>01</span><div><h3>안전 데이터를 더한 경로</h3><p>CCTV·보안등·비상벨 등 주변 안전시설을 함께 고려해 경로를 비교합니다.</p></div></article></Reveal>
          <Reveal delay={.08}><article><span>02</span><div><h3>이동 중 이어지는 연결</h3><p>안심친구와 위치를 공유해 필요한 순간 서로의 현재 위치를 확인합니다.</p></div></article></Reveal>
          <Reveal delay={.13}><article><span>03</span><div><h3>이상 상황 단계적 확인</h3><p>경로 이탈·비활동을 확인하고 무응답이 이어지면 보호자 알림으로 연결합니다.</p></div></article></Reveal>
        </div>
      </section>

      <section id="features" className="feature-section"><div className="shell section">
        <Reveal className="feature-heading"><span className="section-kicker">RIMO FEATURES</span><h2>필요한 순간,<br/>RIMO의 기능을 만나보세요.</h2><p>안심경로부터 안심친구, 안심지도와 긴급 대응까지. 궁금한 기능을 선택해 RIMO가 귀갓길을 어떻게 돕는지 살펴보세요.</p></Reveal>
        <div className="feature-layout">
          <div className="feature-nav" role="tablist">{features.map((f,i)=><button key={f.id} onClick={()=>setActiveFeature(i)} className={i===activeFeature?"active":""}><span>{f.no}</span><b>{f.title}</b><Icon name="arrow" size={15}/></button>)}</div>
          <div className="feature-preview"><AnimatePresence mode="wait"><motion.div key={feature.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}}><FeaturePhone id={feature.id}/></motion.div></AnimatePresence></div>
          <div className="feature-copy"><AnimatePresence mode="wait"><motion.div key={`copy-${feature.id}`} initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} transition={{duration:.25}}><span className="feature-tag">{feature.tag}</span><h3>{feature.title}</h3><p>{feature.summary}</p><div className="feature-point-list">{feature.points.map(x=><span key={x}><Icon name="check" size={13}/>{x}</span>)}</div><small className="interaction-note">기능을 선택하면 해당 화면과 이용 방법을 확인할 수 있어요.</small></motion.div></AnimatePresence></div>
        </div>
      </div></section>

      <section id="howto" className="section shell howto-section">
        <Reveal className="howto-title"><span className="section-kicker">HOW TO USE RIMO</span><h2>안심 귀가,<br/>이렇게 시작해요.</h2><p>목적지를 찾고 경로를 고른 뒤 안심 귀가를 시작하세요. 이동 중에는 귀가 상태를 확인하고, 도착 후에는 기록까지 이어집니다.</p></Reveal>
        <Reveal className="journey-board">
          <div className="journey-mainline">
            <span className="journey-track"/>
            {usage.map((x,i)=><div className="journey-step" key={x.no}><div className="journey-node"><span>{x.no}</span>{i===0?<Icon name="pin"/>:i===1?<Icon name="map"/>:<Icon name="people"/>}</div><div><h3>{x.title}</h3><p>{x.desc}</p></div></div>)}
          </div>
          <div className="journey-branch-label"><span>귀가 진행</span><i/></div>
          <div className="journey-outcomes">
            <div className="journey-outcome normal"><div className="outcome-icon"><Icon name="shield"/></div><div><small>NORMAL ARRIVAL</small><h3>정상 도착</h3><p>목적지에 도착하면 안내가 종료되고 귀가 기록이 리포트에 저장됩니다.</p></div><span className="outcome-badge">귀가 완료</span></div>
            <div className="journey-outcome alert"><div className="outcome-icon"><Icon name="alert"/></div><div className="alert-copy"><small>ABNORMAL SITUATION</small><h3>이상 상황이 감지되면</h3><div className="micro-flow"><span><b>1</b>1차 상태 확인</span><i>→</i><span><b>2</b>10초 최종 확인</span><i>→</i><span><b>3</b>무응답 시 보호자 알림</span></div></div></div>
          </div>
        </Reveal>
      </section>

      <section id="demo" className="demo-section"><div className="shell section demo-grid">
        <Reveal className="demo-copy"><span className="section-kicker light">RIMO DEMO</span><h2>RIMO와 함께하는<br/>귀갓길을 만나보세요.</h2><p>목적지를 찾는 순간부터 안심경로 안내, 위치 공유와 이상 상황 대응까지. RIMO의 주요 기능이 하나의 귀가 과정에서 어떻게 이어지는지 영상으로 확인해보세요.</p><div className="demo-list"><span><Icon name="check" size={13}/> 목적지 검색과 안심경로 선택</span><span><Icon name="check" size={13}/> 안심친구와 함께하는 귀가</span><span><Icon name="check" size={13}/> 이상 상황 확인과 보호자 알림</span></div></Reveal>
        <Reveal className="demo-phone-wrap" delay={.08}><PhoneShell className="demo-phone"><video controls playsInline preload="metadata" poster="/demo-poster.svg"><source src="/rimo-demo.mp4" type="video/mp4"/>브라우저가 비디오 재생을 지원하지 않습니다.</video></PhoneShell><div className="demo-caption"><span>RIMO SERVICE DEMO</span><b>처음부터 도착까지, RIMO의 안심 귀가</b></div></Reveal>
      </div></section>

      <section id="download" className="section shell download-section"><Reveal><div className="download-box"><div className="download-copy"><span className="download-kicker">RIMO APP</span><h2>오늘의 귀갓길부터<br/>RIMO와 함께하세요.</h2><p>QR 코드를 스캔해 RIMO를 다운로드하고, 더 안심되는 귀가를 시작해보세요.</p></div><div className="download-actions"><a href="/RIMO.apk" download className="android-download"><small>DOWNLOAD FOR</small><strong>Android</strong></a><div className="qr-wrap"><div className="qr-only"><img src={rimoQr} alt="RIMO Android 앱 다운로드 QR 코드"/></div><span>QR로 다운로드</span></div></div></div></Reveal></section>
    </main>

    <footer className="footer shell"><div className="footer-brand"><img src={rimoLogo} alt=""/><b>RIMO</b></div><p>더 안심할 수 있는 귀갓길을 위해.</p><span>© 2026 RIMO</span></footer>
  </div>;
}
