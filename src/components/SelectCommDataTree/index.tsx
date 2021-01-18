import { CommDataTypes } from "@/pages/base/comm_data/data.d";
import { CommDataParams } from "@/pages/base/comm_data/data";
import { commDataList } from "@/pages/base/comm_data/service";
import { Select } from "antd"
import { useEffect, useState } from "react";
const { Option } = Select;


const SelectCommDataTree: React.FC = () => {

    
  const [storeLocationList, setStoreLocationList] = useState<CommDataTypes>();

    useEffect(()=>{
		console.log("第一次渲染select-comm-data-tree");
		getStoreLocationList()
    },[])
    
    

    const getStoreLocationList = async() => {
        const res = await commDataList({page:1,page_size:100,sign:1115} as CommDataParams);
        
        console.log( formatTree(res.data.data||[], 0) )
        setStoreLocationList(res.data.data||[])
    }

    

    //格式化tree
    const formatTree = (data:any[],pid:number)=>{
        let arr:any[] = [];
        (data||[]).forEach(v=>{
            if(v.pid==pid){
                v.title = v.name;
                v.expand = true;
                v.render = (h,{root,node,data})=>{
                    return this.createItem(h,{root,node,data})
                }
                let level = this.getLevel(data,pid,1);
                let _step = '_'.repeat(level).split('').map((v,k)=>'_'.repeat(4) ).join(' ');
                this.treeDataSelect.push({
                    id: v.id,
                    pid: v.pid,
                    name: v.name,                        
                    name2: '|' + _step + ' ' + v.name
                })
                v.children = this.formatTree(data,v.id)
                arr.push(v)
            }
        });
        return arr
    }

    //获取当前树形结构等级
    const getLevel = (data,pid,level) => {
        if(pid>0){
            let [item] = data.filter(v=>v.id==pid)
            level = this.getLevel(data,item.pid,level+1)
        }
        return level;
    }

    return (
        <Select showSearch allowClear>
            <Option value="1">上海</Option>
        </Select>
    )
}

export default SelectCommDataTree