const P = (x, y) => [Math.round(x / 16 * 100) / 100, Math.round(y / 10 * 100) / 100];
const room = (id, name, pts, entity, extra = {}) => ({ id, name, points: pts.map(([x, y]) => P(x, y)), entityIds:[entity], tapAction:'toggle', color:'#FFC46B', opacity:.42, feather:18, ...extra });
const badge = (id, name, x, y, unit, style = {}, extra = {}) => ({ id, entityId:id, type:'badge', displayName:name, xPercent:x, yPercent:y, iconMode:'auto', tapAction:'more_info', decimals:1, unitOverride:unit, style:{ width:176, height:96, backgroundOpacity:.82, borderOpacity:.35, ...style }, ...extra });
const ic = { width:78, height:78, iconSize:30, backgroundOpacity:.8, borderOpacity:.3 };
const icon = (id, name, x, y, iconName, on, off, style = {}) => ({ id, entityId:id, type:'icon', displayName:name, xPercent:x, yPercent:y, iconMode:'manual', iconName, iconOn:on, iconOff:off, iconVariantEnabled:true, tapAction:'toggle', style:{ ...ic, ...style } });
const text = (key, value, x, y, extra = {}, style = {}) => ({ id:key, entityId:`hav_text.${key}`, type:'badge', displayName:'', textValue:value, integrationName:'Text / button', sourceDomain:'hav_text', xPercent:x, yPercent:y, iconMode:'manual', iconName:'mdi:gesture-tap-button', iconOn:'mdi:gesture-tap-button', iconOff:'mdi:gesture-tap-button', tapAction:'none', linkAction:'none', unitOverride:'', decimals:'auto', style:{ width:190, height:64, showLabel:false, showIcon:false, backgroundOpacity:.85, borderOpacity:.4, ...style }, ...extra });
const flow = (id, entityId, name, x, y, extra = {}) => ({ id, entityId, displayName:name, xPercent:x, yPercent:y, itemSizeV2:true, rotation:0, shape:'chevron', flowCount:3, flowLength:130, chevronWidth:26, chevronHeight:26, chevronThickness:6, gap:6, color:'#20B9E7', glow:8, animation:'flow', animationSpeed:1.2, deadband:40, ...extra });
// A thermostat exactly as the "Termostat" wizard makes it, placed on the plan; with presets and the boiler pressure as an extra part.
const thermostat = (id, name, entity, x, y, extra = {}) => ({ ...require('./thermostat.json'), id, name, entityIds:[entity], x, y, ...extra });
const layout = { version:2, revision:1, settings:{ language:'en', snapEnabled:false, viewTransition:'slide' }, activeViewId:'home', viewOrder:['home','energy','heating'], views:{
  home:{ id:'home', name:'Home', background:'plan-day.png', nightBackground:'plan-night.png', nightEntity:'input_boolean.night_mode', nightBrightness:118, backgroundColor:'', onboardingDone:true, backgroundTransforms:{ 'plan-day.png':{ mode:'contain', scale:1, x:0, y:0, mobilePanStart:.42 } },
    rooms:{ living: room('living','Living room',[[80,60],[900,60],[900,560],[80,560]],'light.living_room',{ color:'#FFB85C' }),
            kitchen: room('kitchen','Kitchen',[[900,60],[1520,60],[1520,420],[900,420]],'light.kitchen',{ color:'#FFE0A3', opacity:.3 }),
            hall: room('hall','Hall',[[420,560],[900,560],[900,940],[420,940]],'light.hall',{ color:'#FFC878', opacity:.26 }),
            bedroom: room('bedroom','Bedroom',[[900,420],[1520,420],[1520,940],[900,940]],'light.bedroom',{ stateEnabled:true, offColor:'#3D6BFF', offOpacity:.12 }),
            bathroom: room('bathroom','Bathroom',[[80,560],[420,560],[420,940],[80,940]],'light.bathroom',{ stateEnabled:true, offColor:'#2EC5FF', offOpacity:.1 }) },
    flows:{ grid: flow('grid','sensor.house_power','House power',41,75,{ direction:'up', directionMode:'manual', flowLength:120, deadband:0 }) },
    entities:{
      'sensor.living_room_temperature': badge('sensor.living_room_temperature','Living room',24,19,'°C'),
      'sensor.kitchen_temperature': badge('sensor.kitchen_temperature','Kitchen',84,31,'°C'),
      'sensor.bedroom_temperature': badge('sensor.bedroom_temperature','Bedroom',84,53,'°C'),
      'sensor.bathroom_humidity': badge('sensor.bathroom_humidity','Bathroom',15,70,'%',{},{ decimals:0 }),
      'sensor.house_power': { id:'sensor.house_power', entityId:'sensor.house_power', type:'horseshoe', displayName:'Power', xPercent:41, yPercent:33, iconMode:'auto', tapAction:'more_info', decimals:0, unitOverride:'W', style:{ width:196, height:176, contentScale:1.15, showPercent:false, backgroundOpacity:.82, borderOpacity:.3, max:5000, useGradient:true, gradientStart:'#21BCEB', gradientEnd:'#F59E0B' } },
      'light.living_room': icon('light.living_room','Living room',12,19,'mdi:ceiling-light','mdi:ceiling-light','mdi:ceiling-light-outline',{ iconOnColor:'#FFC46B' }),
      'light.kitchen': icon('light.kitchen','Kitchen',66,30,'mdi:lightbulb-group','mdi:lightbulb-group','mdi:lightbulb-group-off',{ iconOnColor:'#FFE0A3' }),
      'light.bedroom': icon('light.bedroom','Bedroom',70,53,'mdi:lamp','mdi:lamp','mdi:lamp-outline'),
      'light.bathroom': icon('light.bathroom','Bathroom',15,85,'mdi:ceiling-light','mdi:ceiling-light','mdi:ceiling-light-outline',{ iconOnColor:'#8FE3FF' }),
      'switch.coffee_machine': icon('switch.coffee_machine','Coffee',74,14,'mdi:coffee-maker','mdi:coffee-maker','mdi:coffee-maker-outline',{ iconOnColor:'#F59E0B' }),
      'input_boolean.night_mode': icon('input_boolean.night_mode','Night mode',32,86,'mdi:weather-night','mdi:weather-night','mdi:white-balance-sunny',{ iconOnColor:'#9DB7FF', iconOffColor:'#FFD166' }),
      'hav_text.to_energy': text('to_energy','Energy →',48,86,{ linkAction:'view', linkView:'energy' },{ width:200 }),
    } },
  energy:{ id:'energy', name:'Energy', background:'', backgroundColor:'#0C1D28', solidCanvasRatio:16/9, solidCanvasSize:{ w:1920, h:1080 }, onboardingDone:true, backgroundTransforms:{}, rooms:{},
    flows:{
      solar: flow('solar','sensor.solar_power','Solar',37,30,{ direction:'right', directionMode:'manual', rotation:22, color:'#FFC53D', deadband:30 }),
      battery: flow('battery','sensor.battery_power','Battery',37,70,{ directionMode:'sign', positiveDirection:'right', negativeDirection:'left', rotation:-22, positiveColor:'#22D69B', negativeColor:'#22D69B', color:'#22D69B' }),
      grid: flow('gridflow','sensor.grid_power','Grid',72,50,{ directionMode:'sign', positiveDirection:'left', negativeDirection:'right', color:'#20B9E7' }),
    },
    entities:{
      'sensor.solar_power': badge('sensor.solar_power','Solar',20,22,'W',{ width:230, height:110, showIcon:true, iconSize:34, iconX:-70, labelX:22, valueX:22, iconColor:'#8FE3FF' },{ decimals:0, iconMode:'manual', iconName:'mdi:solar-power' }),
      'sensor.battery_power': badge('sensor.battery_power','Battery',20,78,'W',{ width:230, height:110, showIcon:true, iconSize:34, iconX:-70, labelX:22, valueX:22, iconColor:'#8FE3FF' },{ decimals:0, iconMode:'manual', iconName:'mdi:home-battery' }),
      'sensor.battery_level': { id:'sensor.battery_level', entityId:'sensor.battery_level', type:'gauge', displayName:'Battery level', xPercent:20, yPercent:50, iconMode:'auto', tapAction:'more_info', decimals:0, unitOverride:'%', style:{ width:230, height:140, max:100, backgroundOpacity:.82, showPercent:false, useGradient:true, gradientStart:'#FF6374', gradientEnd:'#22D69B' } },
      'sensor.house_power': { id:'sensor.house_power', entityId:'sensor.house_power', type:'horseshoe', displayName:'House', xPercent:55,  yPercent:50, iconMode:'auto', tapAction:'more_info', decimals:0, unitOverride:'W', style:{ width:230, height:206, contentScale:1.2, showPercent:false, backgroundOpacity:.82, max:5000, useGradient:true, gradientStart:'#21BCEB', gradientEnd:'#F59E0B' } },
      'sensor.grid_power': badge('sensor.grid_power','Grid',88,50,'W',{ width:230, height:110, showIcon:true, iconSize:34, iconX:-70, labelX:22, valueX:22, iconColor:'#8FE3FF' },{ decimals:0, iconMode:'manual', iconName:'mdi:transmission-tower' }),
      'switch.heat_pump': icon('switch.heat_pump','Heat pump',55,20,'mdi:heat-pump','mdi:heat-pump','mdi:heat-pump-outline',{ iconOnColor:'#FF9F43' }),
      'switch.washing_machine': icon('switch.washing_machine','Washing machine',55,80,'mdi:washing-machine','mdi:washing-machine','mdi:washing-machine-off',{ iconOnColor:'#20B9E7' }),
      'hav_text.title': text('title','Energy flow',50,7,{},{ showBackground:false, showBorder:false, width:320, height:60, valueScale:1.3 }),
      'hav_text.to_home': text('to_home','← Home',9,7,{ linkAction:'view', linkView:'home' }),
      'hav_text.to_heating': text('to_heating','Heating →',89,93,{ linkAction:'view', linkView:'heating' },{ width:210 }),
      'hav_text.repo': text('repo','Get HA Views',89,7,{ linkAction:'url', linkUrl:'https://github.com/VoyteckPL/ha-views', linkNewTab:true },{ width:210 }),
    } },
  heating:{ id:'heating', name:'Heating', background:'', backgroundColor:'#0C1D28', solidCanvasRatio:16/9, solidCanvasSize:{ w:1920, h:1080 }, onboardingDone:true, backgroundTransforms:{},
    rooms:{ heating: thermostat('heating','Living room','climate.living_room',50,52,{ labelCardScale:1.15, thermoPresets:true, thermoFill_heating:'breathe', labelX1:true, labelX1Entity:'sensor.boiler_pressure', labelX1Prefix:'Boiler', labelX1Decimals:'1', labelModesFY:178, labelX1FX:0, labelX1FY:262, labelX1X:0, labelX1Y:262 }) },
    flows:{},
    entities:{
      'hav_text.heating_title': text('heating_title','Heating',50,7,{},{ showBackground:false, showBorder:false, width:320, height:60, valueScale:1.3 }),
      'hav_text.heating_home': text('heating_home','← Home',9,7,{ linkAction:'view', linkView:'home' }),
      'sensor.outdoor_temperature': badge('sensor.outdoor_temperature','Outdoor',85,52,'°C'),
      'switch.heat_pump': icon('switch.heat_pump','Heat pump',15,52,'mdi:heat-pump','mdi:heat-pump','mdi:heat-pump-outline',{ iconOnColor:'#FF9F43', width:110, height:110, iconSize:46 }),
    } } } };
require('fs').writeFileSync(__dirname + '/demo-layout.js', '/* Example layout of the HA Views web demo. */\nwindow.HA_VIEWS_DEMO_LAYOUT = ' + JSON.stringify(layout) + ';\n');
console.log('ok');
