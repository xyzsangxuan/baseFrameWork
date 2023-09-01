import Singleton from '../Manager/Singleton';

export class LocalizationUtils extends Singleton {
     
    public localize(txt:string):string{
        let str:string = txt;
        return str;
    }
    static get Instance(): LocalizationUtils {
        return super.getInstance<LocalizationUtils>();
    }
}

//LocalizationUtils.Instance.localize("s");