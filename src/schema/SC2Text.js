
import { ELocaleId } from "../types/enums.js"
import { CString } from "../types/types.js"

function getTextRelations(value,trace = []){
    let result = []
    value
      .replace(/<d\s+(?:stringref)="(\w+),([\w@]+),(\w+)"\s*\/>/g, (_,namespace,entity,field)=>{
            result.push({type: namespace,value: entity ,trace})
            return ''
      })
      .replace(/<d\s+(?:time|ref)\s*=\s*"(.+?)(?=")"((?:\s+\w+\s*=\s*"\s*([\d\w]+)?\s*")*)\s*\/>/gi, (_,ref,opts) => {
          result.push(...getNestedTextReferenceRelations(ref,trace))
          return ''
      })
      .replace(/<n\/>/g,"<br/>")
      return result
}

function getNestedTextReferenceRelations (value,trace){
    let result = []
      let ref = value.replace(/\[d\s+(?:time|ref)\s*=\s*'(.+?)(?=')'((?:\s+\w+\s*=\s*'\s*([\d\w]+)?\s*')*)\s*\/?\]/gi, (_,ref,opts) => {
          result.push(...this.getNestedTextReferenceRelations(ref,trace))
          return ' '
      })
      ref = ref.replace(/\$(.+?)\$/g,(_,cc)=>{
          let options = cc.split(':')
          switch(options[0]){
              case 'AbilChargeCount':
                  let ability = options[1]
                  result.push({type: "Abil",value: ability ,trace})
                  return ' '
              case 'UpgradeEffectArrayValue':
                  let upgrade = options[1]
                  let effectArrayValue = options[2]
                  {
                    let [namespace,entity] = effectArrayValue.split(",")
                    result.push({type: namespace,value: entity ,trace})
                  }
                  result.push({type: "Upgrade",value: upgrade ,trace})
                  return ' '
          }
          return ''
      })

      ref = ref.replace(/((\w+),([\w@]+),(\w+[\.\w\[\]]*))/g,(_,expr, namespace,entity,fields)=>{
          result.push({type: namespace,value: entity ,trace})
          return ' '
      })
      return result
}

export class CText extends CString {
  static relations(value,trace){
    return getTextRelations(value,trace)
  }
  static validate(str) {
    return true;
  }
}

export const SText = {Value: [CText,ELocaleId]}

export default {
    Text: SText
}