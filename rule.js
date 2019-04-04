/**
 * 需要替换的文本
 * @type {Array}
 */
module.exports.text = [
	['emloxe', 'eee'],
	['Emloxe', 'EEE'],
];

/**
 * 在该文件夹下只执行复制操作，不需要进行关键字匹配替换
 * @type {Array}
 */
module.exports.ignoreDir = ['node_modules', 'ThirdParty'];


/**
 * 在该文件夹下进行忽视
 * @type {Array}
 */
module.exports.notcopy = ['.git'];

/**
 * 该文件类型只执行复制操作
 * @type {Array}
 */
module.exports.ignoreFile = ['.doc','.docx','.xls','.xlsx','.ppt','.pptx','.mp3','.mp4', '.ico', '.jpg', '.png', '.gif', '.bin', '.gltf', '.glb', '.dae', '.b3dm', '.pnts', '.i3dm', '.cmpt', '.geom', '.kml', '.kmz']