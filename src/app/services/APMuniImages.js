import env from './config.js';
/*name: para pagina,
* originalName: para titulo
* queryName: para servicio
*/
const MuniImages = [
  {
    original: env.CSSDIRECTORY + 'images/logos/logos_menu/valparaiso.png',
    thumbnail:  env.CSSDIRECTORY +' images/logos/logos_menu/thumbnails/valparaiso.png',
    name: 'valpo',
    originalName: 'Valparaíso',
    extent: [-71.6127 , -33.0472],
    queryName: 'VALPARAISO'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/lacruz.png',
    thumbnail: 'dist/css/images/logos/logos_menu/thumbnails/lacruz.png',
    name: 'lacruz',
    originalName: 'La Cruz',
    extent: [-71.2273, -32.8258],
    queryName: 'LA CRUZ'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/panquehue.png',
    thumbnail: env.CSSDIRECTORY + 'images/logos/logos_menu/thumbnails/panquehue.png',
    name: 'panquehue',
    originalName: 'Panquehue',
    extent: [-70.8333, -32.767],
    queryName: 'PANQUEHUE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/losandes.png',
    thumbnail: env.CSSDIRECTORY + 'images/logos/logos_menu/losandes.png',
    name: 'losandes',
    originalName: 'Los Andes',
    extent: [-70.5972, -32.8338],
    queryName: 'LOS ANDES'
  }
  /*,"-70.5972","-32.8338"
  {
    original: 'dist/css/images/cityhall_images/logos/logos_menu/callelarga.png',
    thumbnail: 'dist/css/images/cityhall_images/logos/logos_menu/thumbnails/callelarga.png',
    originalClass: 'featured-slide',
    thumbnailClass: 'featured-thumb',
    originalAlt: 'original-alt',
    thumbnailAlt: 'thumbnail-alt',
  //  description: 'Calle Larga',
    size: 'Optional size (image size relative to the breakpoint)'
  },
  {
    original: 'dist/css/images/cityhall_images/logos/logos_menu/concon.png',
    thumbnail: 'dist/css/images/cityhall_images/logos/logos_menu/thumbnails/concon.png'//,
  //  description: 'Concón',
  },
  {
    original: 'dist/css/images/cityhall_images/logos/logos_menu/elquisco.png',
    thumbnail: 'dist/css/images/cityhall_images/logos/logos_menu/thumbnails/elquisco.png',
    originalClass: 'featured-slide',
    thumbnailClass: 'featured-thumb',
    originalAlt: 'original-alt',
    thumbnailAlt: 'thumbnail-alt',
  //  description: 'El Quisco',
    size: 'Optional size (image size relative to the breakpoint)'

  },
  */
]

export default MuniImages;
