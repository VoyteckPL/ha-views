// The sample dashboard of the HA Views web demo: a calm home view (four temperature labels and one flow) and an irrigation view.
const P = (x, y) => [Math.round(x / 16 * 100) / 100, Math.round(y / 10 * 100) / 100];
const room = (id, name, pts, entity, extra = {}) => ({ id, name, points: pts.map(([x, y]) => P(x, y)), entityIds:[entity], tapAction:'toggle', color:'#F2C98A', opacity:.34, feather:22, ...extra });
// A label as the "+ → Label" wizard makes it: icon, name and state of an entity, grouped.
const LABEL = { kind:'icon', points:[], labelIcon:true, labelName:true, labelState:true, labelLinked:true, labelPartGap:12, labelCardPadding:0, labelCardScale:1.1, labelCardBg:true, labelCardBgOpacity:.6, labelCardBlur:true, labelCardRadius:16, labelCardBorder:true, labelCardBorderOpacity:.22,
  labelIconOutline:false, labelIconBg:false, labelIconBorder:false, labelIconSource:'mdi', labelIconColor:'#BFD3DE', labelIconOn:'#E6EEF3', labelIconOff:'#9FB6C3', labelNameBg:false, labelNameBorder:false, labelStateBg:false, labelStateBorder:false, labelIconY:-97, labelNameY:26, labelStateY:123 };
const label = (id, name, entity, x, y, icon, extra = {}) => ({ ...LABEL, id, name, entityIds:[entity], x, y, tapAction:'more_info', labelIconName:icon, ...extra });
const flow = (id, entityId, name, x, y, extra = {}) => ({ id, entityId, displayName:name, xPercent:x, yPercent:y, itemSizeV2:true, rotation:0, shape:'chevron', flowCount:3, flowLength:120, chevronWidth:22, chevronHeight:22, chevronThickness:5, gap:6, color:'#7FB4CF', glow:4, animation:'flow', animationSpeed:1.1, deadband:40, ...extra });
const spr = (x, y, kind, range, dir, arc, extra = {}) => ({ kind, range, dir, arc, speed:5, power:70, x:Math.round(x / 16 * 100) / 100, y:Math.round(y / 10 * 100) / 100, ...extra });
const drip = (pts, extra = {}) => ({ spacing:44, flow:60, tube:3.5, glow:30, spot:100, drop:100, round:0, points:pts.map(([x, y]) => P(x, y)), ...extra });

const layout = { version:2, revision:1, settings:{ language:'en', snapEnabled:false, viewTransition:'slide' }, activeViewId:'home', viewOrder:['home','garden'], views:{
  home:{ id:'home', name:'Home', background:'plan-day.png', nightBackground:'plan-night.png', nightEntity:'input_boolean.night_mode', nightBrightness:112, backgroundColor:'', onboardingDone:true, backgroundTransforms:{ 'plan-day.png':{ mode:'contain', scale:1, x:0, y:0, mobilePanStart:.42 } },
    rooms:{
      living: room('living','Living room',[[80,60],[900,60],[900,560],[80,560]],'light.living_room'),
      kitchen: room('kitchen','Kitchen',[[900,60],[1520,60],[1520,420],[900,420]],'light.kitchen',{ color:'#F7E3BD', opacity:.28 }),
      hall: room('hall','Hall',[[420,560],[900,560],[900,940],[420,940]],'light.hall',{ opacity:.24 }),
      bedroom: room('bedroom','Bedroom',[[900,420],[1520,420],[1520,940],[900,940]],'light.bedroom',{ stateEnabled:true, offColor:'#5F7FB8', offOpacity:.1 }),
      bathroom: room('bathroom','Bathroom',[[80,560],[420,560],[420,940],[80,940]],'light.bathroom',{ stateEnabled:true, offColor:'#6FB3C9', offOpacity:.1 }),
      t_living: label('t_living','Living room','sensor.living_room_temperature',30,24,'mdi:sofa'),
      t_kitchen: label('t_kitchen','Kitchen','sensor.kitchen_temperature',77,24,'mdi:countertop-outline'),
      t_bedroom: label('t_bedroom','Bedroom','sensor.bedroom_temperature',70,62,'mdi:bed-outline'),
      t_hall: label('t_hall','Hall','sensor.hall_temperature',41,68,'mdi:door-open'),
    },
    flows:{ power: flow('power','sensor.house_power','House power',41,86,{ direction:'up', directionMode:'manual', deadband:0 }) },
    entities:{} },
  garden:{ id:'garden', name:'Irrigation', background:'garden-day.png', nightBackground:'garden-night.png', nightEntity:'input_boolean.night_mode', nightBrightness:112, backgroundColor:'', onboardingDone:true, backgroundTransforms:{ 'garden-day.png':{ mode:'contain', scale:1, x:0, y:0, mobilePanStart:.42 } },
    rooms:{
      lawn: { id:'lawn', name:'Lawn', roomEffect:'water', points:[[60,420],[1010,420],[1010,950],[60,950]].map(([x, y]) => P(x, y)), entityIds:['switch.lawn_sprinklers'], tapAction:'toggle', waterColor:'#9CCBE8', waterOpacity:80, waterTint:12, waterClip:true, waterHeads:true,
        sprinklers:{ s1: spr(330, 560, 'rotor', 190, 0, 360), s2: spr(860, 930, 'spray', 190, 0, 200), s3: spr(300, 880, 'rotor', 170, 40, 150, { speed:4 }), s4: spr(900, 520, 'spray', 150, 270, 160) } },
      drip: { ...LABEL, id:'drip', name:'Beds drip', kind:'icon', dripOnly:true, labelName:false, labelState:false, labelIconName:'mdi:water', labelIconSource:'mdi', labelIconOn:'#9CCBE8', labelCardScale:.8, points:[], entityIds:['switch.beds_drip'], tapAction:'toggle', x:65.6, y:51.5, waterColor:'#9CCBE8', waterOpacity:85, waterHeads:true,
        dripLines:{ d1: drip([[1075,515],[1445,515]]), d2: drip([[1075,665],[1445,665]]), d3: drip([[1075,815],[1445,815]]) } },
      l_lawn: label('l_lawn','Lawn','switch.lawn_sprinklers',22,40,'mdi:sprinkler-variant',{ tapAction:'toggle' }),
      l_soil: label('l_soil','Soil moisture','sensor.soil_moisture',83,41,'mdi:water-percent'),
    },
    flows:{}, entities:{} } } };
require('fs').writeFileSync(__dirname + '/demo-layout.js', '/* Example layout of the HA Views web demo. */\nwindow.HA_VIEWS_DEMO_LAYOUT = ' + JSON.stringify(layout) + ';\n');
console.log('ok');
