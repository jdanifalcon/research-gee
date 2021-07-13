// Declaramos dos  momentos temporales para disponer de los datos necesarios
var Tiempo1 = ee.ImageCollection ('COPERNICUS/S2')
  .filterDate ('2020-08-06' ,'2020-08-11') // Momento temporal (1) previo a inundacion
  .filterMetadata ('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 40);
var Secano = Tiempo1.reduce(ee.Reducer.median());

var Tiempo2 = ee.ImageCollection ('COPERNICUS/S2')
  .filterDate ('2020-10-13' ,'2020-10-14') // Momento temporal (2) en inundacion
  .filterMetadata ('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 40);
var Inundacion = Tiempo2.reduce(ee.Reducer.median());

// Analizamos los valores de humedad a partir de las bandas 8 y 11
var Humedad2 = Inundacion.normalizedDifference (['B8_median', 'B11_median']);
var Humedad1 = Secano.normalizedDifference (['B8_median', 'B11_median']);

// Simbolizamos los valores de humedad en el momento de la inundacion
Map.addLayer(Humedad2, {min: -1, max: 0.7, palette: ['#0000ff', 'F1B555', '99B718', '66A000', '3E8601', 
    '056201', '023B01', '011D01', 'blue']},'Inundacion');


// Simbolizamos los valores de humedad previos a la inundacion y vinculamos vistas comparativas
var MapasVinculados = ui.Map();
MapasVinculados.addLayer(Humedad1, {min: -1, max: 0.6, palette: ['#0000ff', 'F1B555', '99B718', '66A000', '3E8601', 
    '056201', '023B01', '011D01', 'blue']},'Pre-Inundacion');

var SWIPE = ui.Map.Linker([ui.root.widgets().get(0), MapasVinculados]);

// Integramos el efecto swipe creando una cortinilla horizontal o vertical
var SWIPE2 = ui.SplitPanel({
  firstPanel: SWIPE.get(0),
  secondPanel: SWIPE.get(1),
  orientation: 'horizontal', //'horizontal' o 'vertical'
  wipe: true,
  style: {stretch: 'both'}});
ui.root.widgets().reset([SWIPE2]);

// Mostramos los mapas vinculados con efecto swipe, centrando zona AOI y asignando zoom
MapasVinculados.setCenter(-0.89, 37.73, 12);