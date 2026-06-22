(function(){
  'use strict';
  if(!window.echarts){
    document.body.innerHTML='<p style="padding:30px;color:#ff8c8c">ECharts 執行環境載入失敗，請確認 vendor/echarts.min.js 存在。</p>';
    return;
  }

  var urlParams=new URLSearchParams(location.search);
  var embedded=urlParams.get('embed')==='1';
  document.body.classList.toggle('is-embedded',embedded);

  var charts=[];
  var dashboard=[];
  var activeInstances=[];
  var theme='dark';
  var toastTimer=null;
  try{ dashboard=JSON.parse(localStorage.getItem('qa-echarts-dashboard')||'[]'); }catch(e){ dashboard=[]; }

  function textColor(){ return getComputedStyle(document.body).getPropertyValue('--text').trim()||'#edf3f9'; }
  function mutedColor(){ return getComputedStyle(document.body).getPropertyValue('--muted').trim()||'#91a0b4'; }
  function borderColor(){ return getComputedStyle(document.body).getPropertyValue('--border').trim()||'rgba(255,255,255,.1)'; }
  function bgColor(){ return 'transparent'; }
  function palette(){
    if(theme==='contrast') return ['#00e5ff','#ffee00','#ff5cff','#7dff5a','#ff8b3d'];
    if(theme==='light') return ['#007cc3','#36a269','#e28a1d','#805ad5','#d34e5e'];
    return ['#2dc4e0','#52d68a','#ffb648','#b08bfa','#ff7f8d'];
  }
  function base(){
    return {
      backgroundColor:bgColor(),
      color:palette(),
      textStyle:{color:textColor(),fontFamily:'Inter, Noto Sans TC, sans-serif'},
      animationDuration:450,
      tooltip:{trigger:'axis',backgroundColor:theme==='light'?'#fff':'#101722',borderColor:borderColor(),textStyle:{color:textColor()}},
      grid:{left:46,right:24,top:42,bottom:38,containLabel:false}
    };
  }
  function axis(){ return {axisLine:{lineStyle:{color:borderColor()}},axisTick:{show:false},axisLabel:{color:mutedColor(),fontSize:10},splitLine:{lineStyle:{color:borderColor(),type:'dashed'}}}; }
  function merge(a,b){
    var out={};Object.keys(a).forEach(function(k){out[k]=a[k];});Object.keys(b).forEach(function(k){out[k]=b[k];});return out;
  }

  var months=['Jan','Feb','Mar','Apr','May','Jun','Jul'];
  charts=[
    {id:'line',name:'Line Trend',category:'trend',desc:'Ordered trend · Tooltip · Legend',qa:'驗證資料點順序、Tooltip 與響應式縮放',option:function(){return merge(base(),{legend:{data:['Score','Target'],textStyle:{color:mutedColor()}},xAxis:merge(axis(),{type:'category',data:months}),yAxis:merge(axis(),{type:'value',min:50,max:100}),series:[{name:'Score',type:'line',smooth:true,symbolSize:7,data:[62,68,66,79,82,88,91]},{name:'Target',type:'line',symbol:'none',lineStyle:{type:'dashed'},data:[70,72,74,78,82,86,90]}]});}},
    {id:'area',name:'Area Progress',category:'trend',desc:'Cumulative progression · Emphasis',qa:'驗證面積填色、懸停強調與邊界值',option:function(){var b=base();return merge(b,{tooltip:{trigger:'axis',backgroundColor:theme==='light'?'#fff':'#101722',borderColor:borderColor(),textStyle:{color:textColor()}},xAxis:merge(axis(),{type:'category',data:months}),yAxis:merge(axis(),{type:'value'}),series:[{name:'Completed cases',type:'line',smooth:true,areaStyle:{opacity:.22},data:[18,26,39,51,67,78,92]}]});}},
    {id:'bar',name:'Bar Comparison',category:'compare',desc:'Category comparison · Data label',qa:'驗證排序、長標籤與資料標示',option:function(){return merge(base(),{tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},xAxis:merge(axis(),{type:'category',data:['API','RWD','Form','Permission','A11y']}),yAxis:merge(axis(),{type:'value'}),series:[{name:'Cases',type:'bar',barMaxWidth:42,label:{show:true,position:'top',color:textColor()},data:[13,16,13,11,13]}]});}},
    {id:'stacked',name:'Stacked Coverage',category:'compare',desc:'Manual vs automation candidate',qa:'驗證堆疊總量、圖例切換與比例判讀',option:function(){return merge(base(),{legend:{data:['Manual','Automation candidate'],textStyle:{color:mutedColor()}},tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},xAxis:merge(axis(),{type:'category',data:['API','RWD','Form','Permission']}),yAxis:merge(axis(),{type:'value'}),series:[{name:'Manual',type:'bar',stack:'total',data:[3,6,2,3]},{name:'Automation candidate',type:'bar',stack:'total',data:[10,10,11,8]}]});}},
    {id:'donut',name:'Donut Distribution',category:'distribution',desc:'Part-to-whole · Select emphasis',qa:'驗證總和、標籤遮擋與 Legend 選取',option:function(){return merge(base(),{tooltip:{trigger:'item',backgroundColor:theme==='light'?'#fff':'#101722',borderColor:borderColor(),textStyle:{color:textColor()}},legend:{bottom:8,textStyle:{color:mutedColor()}},series:[{type:'pie',radius:['38%','67%'],center:['50%','43%'],avoidLabelOverlap:true,label:{color:textColor(),formatter:'{b}\n{d}%'},data:[{name:'High',value:4},{name:'Medium',value:3},{name:'Low',value:4}]}]});}},
    {id:'radar',name:'Radar Capability',category:'distribution',desc:'Multi-dimension comparison',qa:'驗證量尺一致性、維度順序與可讀性',option:function(){return merge(base(),{tooltip:{trigger:'item',backgroundColor:theme==='light'?'#fff':'#101722',borderColor:borderColor(),textStyle:{color:textColor()}},legend:{bottom:4,data:['Current','Target'],textStyle:{color:mutedColor()}},radar:{radius:'62%',indicator:[{name:'Requirement',max:100},{name:'Risk',max:100},{name:'Test Design',max:100},{name:'Automation',max:100},{name:'UX',max:100}],axisName:{color:mutedColor()},splitLine:{lineStyle:{color:borderColor()}},splitArea:{areaStyle:{color:['transparent','rgba(255,255,255,.015)']}}},series:[{type:'radar',data:[{name:'Current',value:[88,84,91,72,80],areaStyle:{opacity:.18}},{name:'Target',value:[95,90,95,85,88]}]}]});}},
    {id:'gauge',name:'Gauge Status',category:'status',desc:'Single KPI · Threshold feedback',qa:'驗證 0／100 邊界、狀態文字與色彩之外的訊息',option:function(){return merge(base(),{series:[{type:'gauge',startAngle:210,endAngle:-30,min:0,max:100,splitNumber:5,progress:{show:true,width:14},axisLine:{lineStyle:{width:14,color:[[1,borderColor()]]}},axisTick:{show:false},splitLine:{length:8,lineStyle:{color:mutedColor()}},axisLabel:{color:mutedColor(),distance:20,fontSize:9},pointer:{width:4,length:'58%'},detail:{valueAnimation:true,formatter:'{value}%\nCoverage',color:textColor(),fontSize:19,lineHeight:25,offsetCenter:[0,'55%']},data:[{value:82,name:'Regression'}]}]});}},
    {id:'scatter',name:'Scatter Relationship',category:'relationship',desc:'Risk impact × likelihood',qa:'驗證重疊點、座標範圍與 Tooltip 對應',option:function(){return merge(base(),{tooltip:{trigger:'item',backgroundColor:theme==='light'?'#fff':'#101722',borderColor:borderColor(),textStyle:{color:textColor()},formatter:function(p){return p.data[2]+'<br>Impact: '+p.data[0]+'<br>Likelihood: '+p.data[1];}},xAxis:merge(axis(),{type:'value',name:'Impact',nameTextStyle:{color:mutedColor()},min:0,max:4,interval:1}),yAxis:merge(axis(),{type:'value',name:'Likelihood',nameTextStyle:{color:mutedColor()},min:0,max:4,interval:1}),series:[{type:'scatter',symbolSize:function(v){return 12+v[0]*v[1]*3;},data:[[3,3,'Boundary decision'],[3,2,'Recovery timeout'],[2,2,'Pointer input'],[1,2,'Ball model'],[2,1,'Scene loading']]}]});}}
  ];

  function destroy(){
    activeInstances.forEach(function(instance){ if(instance && !instance.isDisposed()){ instance.dispose(); } });
    activeInstances=[];
  }
  function createChart(el,definition){
    var instance=echarts.init(el,null,{renderer:'canvas'});
    instance.showLoading('default',{text:'Loading chart…',color:palette()[0],textColor:mutedColor(),maskColor:'transparent'});
    window.setTimeout(function(){ if(!instance.isDisposed()){instance.hideLoading();instance.setOption(definition.option(),true);} },120);
    activeInstances.push(instance);
    return instance;
  }
  function saveDashboard(){ try{localStorage.setItem('qa-echarts-dashboard',JSON.stringify(dashboard));}catch(e){} }
  function showToast(message){
    var t=document.getElementById('toast');t.textContent=message;t.classList.add('is-show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove('is-show');},1500);
  }
  function filtered(){
    var q=document.getElementById('searchInput').value.trim().toLowerCase();
    var category=document.getElementById('categorySelect').value;
    return charts.filter(function(c){return (!q||(c.name+' '+c.desc+' '+c.qa).toLowerCase().indexOf(q)>=0)&&(category==='all'||c.category===category);});
  }
  function renderLibrary(){
    destroy();
    var data=filtered();
    document.getElementById('resultCount').textContent=data.length;
    var grid=document.getElementById('chartGrid');
    if(!data.length){grid.innerHTML='<div class="dashboard-empty"><div><strong>找不到符合條件的圖表</strong><p>請清除搜尋文字或切換分類。</p></div></div>';return;}
    grid.innerHTML=data.map(function(c){var added=dashboard.indexOf(c.id)>=0;return '<article class="chart-card"><div class="chart-card-head"><div><h2>'+c.name+'</h2><p>'+c.desc+'</p></div><span class="category">'+c.category+'</span></div><div class="chart-canvas" id="chart-'+c.id+'" role="img" aria-label="'+c.name+' ECharts demonstration"></div><div class="chart-card-foot"><span>'+c.qa+'</span><button type="button" class="add-btn" data-add="'+c.id+'" '+(added?'disabled':'')+'>'+(added?'已加入':'+ Dashboard')+'</button></div></article>';}).join('');
    data.forEach(function(c){createChart(document.getElementById('chart-'+c.id),c);});
  }
  function renderDashboard(){
    destroy();
    var grid=document.getElementById('dashboardGrid');
    if(!dashboard.length){grid.innerHTML='<div class="dashboard-empty"><div><strong>尚未加入圖表</strong><p>回到 Visualization Library 選擇圖表，或使用「加入示例」。</p></div></div>';return;}
    grid.innerHTML=dashboard.map(function(id,index){var c=charts.find(function(x){return x.id===id;});if(!c)return '';return '<article class="dashboard-card"><div class="dashboard-card-head"><div><h3>'+c.name+'</h3><span class="category">'+c.category+'</span></div><div class="actions"><button type="button" data-move="left" data-id="'+id+'" aria-label="向前移動 '+c.name+'">←</button><button type="button" data-move="right" data-id="'+id+'" aria-label="向後移動 '+c.name+'">→</button><button type="button" data-remove="'+id+'" aria-label="移除 '+c.name+'">×</button></div></div><div class="chart-canvas" id="dashboard-'+id+'" role="img" aria-label="Dashboard '+c.name+' chart"></div></article>';}).join('');
    dashboard.forEach(function(id){var c=charts.find(function(x){return x.id===id;});if(c){createChart(document.getElementById('dashboard-'+id),c);}});
  }
  function setView(view){
    var library=view==='library';
    document.getElementById('libraryView').hidden=!library;
    document.getElementById('dashboardView').hidden=library;
    document.querySelectorAll('[data-view]').forEach(function(btn){var active=btn.dataset.view===view;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',active?'true':'false');});
    if(library)renderLibrary();else renderDashboard();
    try{history.replaceState(null,'','?mode='+view+(embedded?'&embed=1':''));}catch(e){}
  }
  function applyTheme(next){
    theme=next;
    document.body.classList.toggle('theme-light',next==='light');
    document.body.classList.toggle('theme-contrast',next==='contrast');
    var current=document.getElementById('dashboardView').hidden?'library':'dashboard';
    if(current==='library')renderLibrary();else renderDashboard();
  }

  document.querySelectorAll('[data-view]').forEach(function(btn){btn.addEventListener('click',function(){setView(btn.dataset.view);});});
  document.getElementById('searchInput').addEventListener('input',renderLibrary);
  document.getElementById('categorySelect').addEventListener('change',renderLibrary);
  document.getElementById('themeSelect').addEventListener('change',function(e){applyTheme(e.target.value);});
  document.getElementById('chartGrid').addEventListener('click',function(e){
    var btn=e.target.closest('[data-add]');if(!btn)return;
    if(dashboard.length>=6){showToast('Dashboard 最多可加入六張圖表');return;}
    var id=btn.dataset.add;if(dashboard.indexOf(id)<0){dashboard.push(id);saveDashboard();renderLibrary();showToast('已加入 Dashboard');}
  });
  document.getElementById('dashboardGrid').addEventListener('click',function(e){
    var remove=e.target.closest('[data-remove]');var move=e.target.closest('[data-move]');
    if(remove){dashboard=dashboard.filter(function(id){return id!==remove.dataset.remove;});saveDashboard();renderDashboard();return;}
    if(move){var id=move.dataset.id;var i=dashboard.indexOf(id);var j=move.dataset.move==='left'?i-1:i+1;if(j>=0&&j<dashboard.length){var swap=dashboard[j];dashboard[j]=dashboard[i];dashboard[i]=swap;saveDashboard();renderDashboard();}}
  });
  document.getElementById('seedDashboard').addEventListener('click',function(){dashboard=['line','bar','donut','gauge'];saveDashboard();renderDashboard();showToast('已加入四張示例');});
  document.getElementById('clearDashboard').addEventListener('click',function(){dashboard=[];saveDashboard();renderDashboard();showToast('Dashboard 已清空');});

  var resizeTimer=null;
  window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){activeInstances.forEach(function(c){if(c&&!c.isDisposed())c.resize();});},80);},{passive:true});
  window.addEventListener('beforeunload',destroy);

  var initial=urlParams.get('mode')==='dashboard'?'dashboard':'library';
  setView(initial);
})();
