/**
 * 需要替换的文本
 * @type {Array}
 */
module.exports.text = [
	['emloxe', 'EMLOXE'],
	['eee', 'EEE'],
];

/**
 * 在该文件夹下只执行复制操作，不需要进行关键字匹配替换，直接进行复制
 * @type {Array}
 */
module.exports.ignoreDir = ['node_modules', 'ThirdParty'];


/**
 * 在该文件夹下进行忽视，不会进行复制到新的位置
 * @type {Array}
 */
module.exports.notcopy = ['.git'];

/**
 * 该文件类型只执行复制操作，但会对文件名称进行替换
 * @type {Array}
 */
module.exports.ignoreFile = ['.doc','.docx','.xls','.xlsx','.ppt','.pptx','.mp3','.mp4', '.ico', '.jpg', '.png', '.gif', '.bin', '.gltf', '.glb', '.dae', '.b3dm', '.pnts', '.i3dm', '.cmpt', '.geom', '.kml', '.kmz']