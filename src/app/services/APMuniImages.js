import env from './config.js';
/*name: para pagina,
* originalName: para titulo
* queryName: para servicio
*/
const MuniImages = [
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/algarrobo.png',
    name: 'algarrobo',
    originalName: 'Algarrobo',
    extent: [-71.67062, -33.3648],
    queryName: 'ALGARROBO'
  },
  {
    original: env.CSSDIRECTORY + 'images/logos/logos_menu/cabildo.png',
    name: 'cabildo',
    originalName: 'Cabildo',
    extent: [-71.0662 , -32.4258],
    queryName: 'CABILDO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/callelarga.png',
    name: 'callelarga',
    originalName: 'Calle Larga',
    extent: [-70.6258, -32.8575],
    queryName: 'CALLE LARGA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/cartagena.png',
    name: 'cartagena',
    originalName: 'Cartagena',
    extent: [-71.6046, -33.5482],
    queryName: 'CARTAGENA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/casablanca.png',
    name: 'casablanca',
    originalName: 'Casablanca',
    extent: [-71.4076, -33.319],
    queryName: 'CASABLANCA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/catemu.png',
    name: 'catemu',
    originalName: 'Catemu',
    extent: [-71.4076, -33.319],
    queryName: 'CATEMU'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/cauquenes.png',
    name: 'cauquenes',
    originalName: 'Cauquénes',
    extent: [-72.3314, -35.9597],
    queryName: 'CAUQUÉNES'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/colbun.png',
    name: 'colbun',
    originalName: 'Colbún',
    extent: [-71.4069, -35.6985],
    queryName: 'COLBÚN'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/concon.png',
    name: 'concon',
    originalName: 'Concón',
    extent: [-71.5235, -32.9239],
    queryName: 'CONCON'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/constitucion.png',
    name: 'constitucion',
    originalName: 'Constitución',
    extent: [-72.4094, -35.3335],
    queryName: 'CONSTITUCIÓN'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/curacavi.png',
    name: 'curacavi',
    originalName: 'Curacaví',
    extent: [-71.1575, -33.4004],
    queryName: 'CURACAVI'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/elquisco.png',
    name: 'elquisco',
    originalName: 'El Quisco',
    extent: [-71.6982, -33.3986],
    queryName: 'EL QUISCO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/eltabo.png',
    name: 'eltabo',
    originalName: 'El Tabo',
    extent: [-71.6669, -33.4557],
    queryName: 'EL TABO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/empedrado.png',
    name: 'empedrado',
    originalName: 'Empedrado',
    extent: [-72.2861, -35.5924],
    queryName: 'Empedrado'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/hijuelas.png',
    name: 'hijuelas',
    originalName: 'Hijuelas',
    extent: [-71.1437, -32.798],
    queryName: 'HIJUELAS'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/lacalera.png',
    name: 'lacalera',
    originalName: 'La Calera',
    extent: [-71.204, -32.7878],
    queryName: 'LA CALERA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/lacruz.png',
    name: 'lacruz',
    originalName: 'La Cruz',
    extent: [-71.2273, -32.8258],
    queryName: 'LA CRUZ'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/laligua.png',
    name: 'laligua',
    originalName: 'La Ligua',
    extent: [-71.2326, -32.4499],
    queryName: 'LA LIGUA'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/limache.png',
    name: 'limache',
    originalName: 'Limache',
    extent: [-71.2596, -33.0095],
    queryName: 'LIMACHE'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/linares.png',
    name: 'linares',
    originalName: 'Linares',
    extent: [-71.6049, -35.8465],
    queryName: 'LINARES'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/llayllay.png',
    name: 'llayllay',
    originalName: 'Llay Llay',
    extent: [-70.9428, -32.8444],
    queryName: 'LLAY LLAY'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/longavi.png',
    name: 'longavi',
    originalName: 'Longaví',
    extent: [-71.6899, -35.9623],
    queryName: 'LONGAVÍ'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/losandes.png',
    name: 'losandes',
    originalName: 'Los Andes',
    extent: [-70.5972, -32.8338],
    queryName: 'LOS ANDES'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/ninhue.png',
    name: 'ninhue',
    originalName: 'Ninhue',
    extent: [-72.4061, -36.3947],
    queryName: 'NINHUE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/nogales.png',
    name: 'nogales',
    originalName: 'Nogales',
    extent: [-71.2078, -32.7382],
    queryName: 'NOGALES'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/ñiquen.png',
    name: 'ñiquen',
    originalName: 'Ñiquén',
    extent: [-71.9102, -36.2941],
    queryName: 'ÑIQUEN'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/olmue.png',
    name: 'olmue',
    originalName: 'Olmué',
    extent: [-71.1893,-32.9962],
    queryName: 'OLMUE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/panquehue.png',
    name: 'panquehue',
    originalName: 'Panquehue',
    extent: [-70.8333, -32.767],
    queryName: 'PANQUEHUE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/parral.png',
    name: 'parral',
    originalName: 'Parral',
    extent: [-71.8373, -36.1462],
    queryName: 'PARRAL'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/puchuncavi.png',
    name: 'puchuncavi',
    originalName: 'Puchuncaví',
    extent: [-71.4122, -32.7275],
    queryName: 'PUCHUNCAVI'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/putaendo.png',
    name: 'putaendo',
    originalName: 'Putaendo',
    extent: [-70.7177, -32.6285],
    queryName: 'PUTAENDO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/quillota.png',
    name: 'quillota',
    originalName: 'Quillota',
    extent: [-71.2497, -32.8803],
    queryName: 'QUILLOTA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/quilpue.png',
    name: 'quilpue',
    originalName: 'Quilpué',
    extent: [-71.4311, -33.0497],
    queryName: 'QUILPUE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/quintero.png',
    name: 'quintero',
    originalName: 'Quintero',
    extent: [-71.5313, -32.7660],
    queryName: 'QUINTERO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/retiro.png',
    name: 'retiro',
    originalName: 'Retiro',
    extent: [-71.7667,  -36.0500],
    queryName: 'RETIRO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/rinconada.png',
    name: 'rinconada',
    originalName: 'Rinconada',
    extent: [-70.7068,  -32.8774],
    queryName: 'RINCONADA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/sanantonio.png',
    name: 'sanantonio',
    originalName: 'San Antonio',
    extent: [-71.6131,  -33.5836],
    queryName: 'SAN ANTONIO'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/sancarlos.png',
    name: 'sancarlos',
    originalName: 'San Carlos',
    extent: [-71.9862,  -36.4199],
    queryName: 'SAN CARLOS'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/sanesteban.png',
    name: 'sanesteban',
    originalName: 'San Esteban',
    extent: [-70.5937,  -32.8081],
    queryName: 'SAN ESTEBAN'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/sanfelipe.png',
    name: 'sanfelipe',
    originalName: 'San Felipe',
    extent: [-70.7208,  -32.75],
    queryName: 'SAN FELIPE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/sanjavier.png',
    name: 'sanjavier',
    originalName: 'San Javier',
    extent: [-71.7369,  -35.5908],
    queryName: 'SAN JAVIER'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/santamaria.png',
    name: 'santamaria',
    originalName: 'Santa María',
    extent: [-70.6587,  -32.747],
    queryName: 'SANTA MARIA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/santodomingo.png',
    name: 'santodomingo',
    originalName: 'Santo Domingo',
    extent: [-71.6309,  -33.6366],
    queryName: 'SANTO DOMINGO'
  },
  {
    original: env.CSSDIRECTORY + 'images/logos/logos_menu/valparaiso.png',
    name: 'valparaiso',
    originalName: 'Valparaíso',
    extent: [-71.6272 ,-33.0394],
    queryName: 'VALPARAISO'

  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/villaalegre.png',
    name: 'villaalegre',
    originalName: 'Villa Alegre',
    extent: [-71.6829,  -35.6869],
    queryName: 'VILLA ALEGRE'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/villaalemana.png',
    name: 'villaalemana',
    originalName: 'Villa Alemana',
    extent: [-71.3734,  -33.0476],
    queryName: 'VILLA ALEMANA'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/vinadelmar.png',
    name: 'vinadelmar',
    originalName: 'Viña del Mar',
    extent: [-71.5523,  -33.0245],
    queryName: 'VIÑA DEL MAR'
  },
  {
    original:  env.CSSDIRECTORY + 'images/logos/logos_menu/yerbasbuenas.png',
    name: 'yerbasbuenas',
    originalName: 'Yerbas Buenas',
    extent: [-71.5833,  -35.7500],
    queryName: 'YERBAS BUENAS'
  }






]

export default MuniImages;
