import { CommDataTypes } from "@/pages/base/comm_data/data.d";
import { CommDataParams } from "@/pages/base/comm_data/data";
import { commDataList } from "@/pages/base/comm_data/service";
import { Select } from "antd"
import { useEffect, useState } from "react";
const { Option } = Select;

type CommDataProps = {
    sign: string;
    defaultValue:number|string;
    onChange: (value: number, formVals?: any) => void;
  };

const SelectCommDataTree: React.FC<CommDataProps> = (props) => {

    const {
        sign,
        defaultValue
    } = props;

    
  const [storeLocationList, setStoreLocationList] = useState<any[]>([]);

    useEffect(()=>{
		console.log("第一次渲染select-comm-data-tree");
		console.log(props.sign,sign);
		getStoreLocationList()
    },[])
    
    

    const getStoreLocationList = async() => {
        const res = await commDataList({page:1,page_size:100,sign:sign} as CommDataParams);
        let list = formatTree(res.data.data||[], 0) 
        console.log( list )
        setStoreLocationList(list)
    }

    

    //格式化tree
    const formatTree = (data:any[],pid:number)=>{
        let treeDataSelect:any[] = [];
        (data||[]).forEach(v=>{
            if(v.pid==pid){
                let level = getLevel(data,pid,1);
                let _step = '_'.repeat(level).split('').map((v,k)=>'_'.repeat(4) ).join(' ');
                treeDataSelect.push({
                    id: v.id,
                    pid: v.pid,
                    name: v.name,                        
                    name2: '|' + _step + ' ' + v.name
                })
                let arr = formatTree(data, v.id)
                if(arr.length){
                    treeDataSelect = treeDataSelect.concat(arr)
                }
            }
        });
        return treeDataSelect
    }

    //获取当前树形结构等级
    const getLevel = (data:any[],pid:number,level:number) => {
        if(pid>0){
            let [item] = data.filter(v=>v.id==pid)
            level = getLevel(data,item.pid,level+1)
        }
        return level;
    }

    const onChange = (value:number,option: any) =>{
        let list = []
        if(value){
            list = getChildren(value)
            list.reverse()
        }
        props.onChange(value,list)
    }

    const getChildren = (pid:number) => {
        let arr = []
        let [item] = storeLocationList.filter(v=>v.id==pid)
        if(item){
            arr.push(item)
            let children:any[] = getChildren(item.pid)
            if(children.length>0){
                arr = arr.concat(children)
            }
        }
        return arr
    }

    return (
        <Select onChange={onChange} defaultValue={defaultValue} showSearch allowClear>
            {storeLocationList.map((v:any)=>(
                <Option value={v.id} key={v.id}>{v.name2}</Option>
            ))}
            
        </Select>
    )
}

export default SelectCommDataTree // Authorized //