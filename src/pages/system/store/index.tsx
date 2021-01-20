import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Select, Table, Modal,Space, Card  } from 'antd';
import React from 'react';
import type {  StoreTypes,StoreParams } from './data.d';
import { storeForm, storeAdd, storeDelete, storeItem, storeList } from './service';
import { rabcRoleList } from '../rabc_role/service';
import { FormInstance } from 'antd/lib/form';
import { RabcRouteParams } from '../rabc_route/data';
import { RabcRoleTypes } from '../rabc_role/data';
import { commDataList } from '@/pages/base/comm_data/service';
import { CommDataParams } from '@/pages/base/comm_data/data';
import SelectCommDataTree from "@/components/SelectCommDataTree";
const { Option } = Select;

class storeComponent extends React.Component{

    state = {
        formValues:{},
        data: [],        
        pagination: {
            total:0,
            current: 1,
            pageSize: 10,
        },
        storeSubjectList:[],
        storeLocationList:[],
        defaultSelectedKey: '',
        defaultCheckedKeys: ([]) as string[],
        loading: false,
        isModalVisible: false
    };

    
    params:StoreParams = {
        page:1,
        page_size:10,
    }

    formRef  = React.createRef<FormInstance>()   

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        this.getList()
        this.getStoreLocationList()
        this.getStoreSubjectList()
    }

    private async getStoreSubjectList() {
		const res = await commDataList({page:1,page_size:100,sign:1116} as CommDataParams);
		this.setState({storeSubjectList: (res.data.data||[]) })
	}

    private async getStoreLocationList(){
        const res = await commDataList({page:1,page_size:100,sign:1115} as CommDataParams);
        this.setState({storeLocationList: (res.data.data||[]) })
    }

    handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
        this.params.page = pagination.current  
        this.params.page_size = pagination.pageSize      
        this.getList()
      };

    private formatTree(data:any[],pid:number){
        let arr:any[] = []
        data.forEach((v:any)=>{
            if(v.pid===pid){
                v.key = v.id+''
                v.title = v.name
                v.children = this.formatTree(data,v.id)
                arr.push(v)
            }
        })
        return arr
    }

    private async getList(){
        this.setState({ loading: true });
        let res = await storeList(this.params)
        this.setState({
            loading: false,
            data: (res.data.data||[]),
            pagination: {
                total: res.data.pagenation.total,
                current: res.data.pagenation.page,
                pageSize: res.data.pagenation.page_size
            }
        })
    }

    private add(){
        this.setState({
            defaultCheckedKeys:[],
          formValues: {},
          isModalVisible:true
        })
    }

    private edit(item:StoreTypes){   
        console.log( item.city_id||item.province_id )     
        this.setState({
            defaultSelectedKey: item.city_id||item.province_id,
            formValues: Object.assign({}, item),
            isModalVisible:true
        })
    }

    private async save(values:StoreTypes){
        console.log(values)
        let form = Object.assign({}, this.state.formValues, values)
        try {
            const res = await storeAdd(form)
            if(res.status===0){
                this.setState({isModalVisible:false})
                message.success('保存成功')
                this.getList()
            }else{
                message.error(res.message)
            }
            console.log(res)
        } catch (error) {
            console.log(error)            
        }        
    }

    private async delete(values:StoreTypes){
      console.log(values)
      try {
        const res = await storeDelete(values.id||0)
        if(res.status===0){
            message.success('操作成功')
            this.getList()
        }else{
            message.error(res.message)
        }
        console.log(res)
      } catch (error) {
        console.log(error)            
      } 
    }

    private async handleSubmit(event:React.MouseEvent<HTMLElement, MouseEvent>){
      event.preventDefault()
      try {
        const values = await this.formRef.current?.validateFields();
        this.save(values);
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        message.warn('提交校验失败')
      }
    }

    
    onSelect = (e:any)=>{
        console.log(e)
    }

    onCheck = (e:any)=>{
        console.log(e.checked)
        this.formRef.current?.setFieldsValue({route_ids: e.checked.join(',')})
    }

    changeLocation = (value:number,list:any[])=>{
        console.log(value, list)
        let form = {
            province_id: '',
            province_name: '',
            city_id: '',
            city_name: '',
        }
        if(list.length>0){
            form.province_id = list[0].id
            form.province_name = list[0].name
        }
        if(list.length>1){
            form.city_id = list[1].id
            form.city_name = list[1].name
        }
        console.log( form )
        let formValues = Object.assign({},this.state.formValues,form)
        this.setState({ formValues })
    }


    public render() {
          
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '简称',
                dataIndex: 'small_name',
                key: 'small_name',
            },
            {
                title: '门店电话',
                dataIndex: 'phone2',
                key: 'phone2',
            },
            {
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '门店经理',
                dataIndex: 'store_manager',
                key: 'store_manager',
            },
            {
                title: '门店主体',
                dataIndex: 'store_subject_name',
                key: 'store_subject_name',
            },
            {
                title: '地区',
                dataIndex: 'base_location_name',
                key: 'base_location_name',
                render:(_:any, record:any)=>( record.province_name+' '+record.city_name )
            },
            {
                title: '地址',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render:(_:any, record:any)=>(record.status===0?'正常':'禁用')
            },
            {
                title: '操作',
                dataIndex: 'status',
                key: 'status',
                render: (_:any, record:any)=> (
                    <Space size="middle">
                      <a onClick={this.edit.bind(this,record)}>编辑</a>
                    </Space>
                )
            },
        ];

        const { formValues, data, pagination, loading, isModalVisible } = this.state; 

        return <Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
            <div style={{ marginBottom: 16,textAlign:'right' }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增
                </Button>
            </div>
             
            <Table 
                size="small"
                bordered
                dataSource={data} 
                columns={columns} 
                rowKey="id"
                loading={loading} 
                pagination={pagination}  
                onChange={this.handleTableChange}              
            />
            {isModalVisible && <Modal title="编辑" visible={isModalVisible} onOk={this.handleSubmit} onCancel={()=>{this.setState({isModalVisible:false})}}>
                <Form
                    labelCol= {{ span: 4 }}
                    wrapperCol= {{ span: 20 }}
                    name="form"
                    ref={this.formRef}  
                    initialValues={formValues}
                    onFinish={this.save}
                    >
                    <Form.Item
                        label="门店名称"
                        name="name"
                        rules={[{ required: true, message: '请输入门店名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="门店简称"
                        name="small_name"
                        rules={[{ required: true, message: '请输入门店简称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="门店电话"
                        name="phone2"
                        rules={[{ required: true, message: '请输入门店电话!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="联系电话"
                        name="phone"
                        rules={[{ required: true, message: '请输入联系电话!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="门店经理"
                        name="store_manager"
                        rules={[{ required: true, message: '请输入门店经理!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="门店主体"
                        name="store_subject_id"
                        rules={[{ required: true, message: '请输入门店主体!' }]}
                    >
                        <Select showSearch allowClear>
                            {this.state.storeSubjectList.map((v:any)=>(<Option value={v.id} key={v.id}>{v.name}</Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="地区"
                        name="province_id"
                        rules={[{ required: true, message: '请选择地区!' }]}
                    >
                        <SelectCommDataTree sign="1115" defaultValue={this.state.defaultSelectedKey} onChange={this.changeLocation}></SelectCommDataTree>
                       
                    </Form.Item>
                    <Form.Item
                        label="地址"
                        name="address"
                        rules={[{ required: true, message: '请选择地址!' }]}
                    >
                        <Input />
                    </Form.Item>  
                    <Form.Item
                        label="备注"
                        name="remark"
                    >
                        <Input.TextArea />
                    </Form.Item>                    
                </Form>
            </Modal> }
        </Card>;
    }

}

export default storeComponent