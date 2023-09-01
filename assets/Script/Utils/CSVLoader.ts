/**
 * CSV表格读取工具
 * 换成远程获取之后暂不需要
 */
export default class CSVLoader {
    /**
     * 将CSV数据转换为静态类
     * @param csvData CSV数据
     * @returns 转换后的静态类
     */
    public static parse(csvData: string): any {
      const lines = csvData.split('\n');
      const header = lines[0].split(',');
      const commentLine = lines[1].startsWith('#'); // 检查第二行是否以'#'开始作为注释行
  
      const result = [];
  
      for (let i = commentLine ? 2 : 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length !== header.length) {
          continue;
        }
  
        const item: any = {};
        for (let j = 0; j < header.length; j++) {
          item[header[j]] = currentLine[j];
        }
  
        result.push(item);
      }
  
      return result;
    }
  }
  