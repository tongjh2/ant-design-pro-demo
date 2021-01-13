import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, message, Space, Popconfirm, Modal,Form, Input, Select,Card  } from 'antd';
import React, { useState, useEffect } from 'react';
import type { ExplainPostItem,ExplainPostPagination,ExplainPostParams } from './data.d';
import { explainPostList, explainPostUpdateStatus, explainPostAdd, explainPostDelete } from './service';


let explainPostItem: ExplainPostItem = {
	title: '',
	images: '',
	author: '',
	explain_category_id: 0,
	explain_kind: 0,
	description: '',
	content: '',
}


const ExplainPost: React.FC = () => {

  const [updateModalVisible, handleModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<ExplainPostItem>(explainPostItem);
  const [selectedRowsState, setSelectedRows] = useState<ExplainPostItem[]>([]);
  const [pagination, setPagination] = useState<ExplainPostPagination>();

 	  
	const [form] = Form.useForm();

  	useEffect(()=>{
		console.log("第一次渲染");
		getList() 
	},[])

	let params:ExplainPostParams = {
		q:'',//标题
		explain_category_id:'', //讲解分类id
		explain_kind:'', //讲解种类 1 病理 2病因/病程 3 优势 4 案例
		explain_category_name:'',
		explain_kind_name:'',
		status:'',      //状态
		page:1,
		page_size:10,
	}

	const handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });		 
		params.page = pagination.current
		params.page_size = pagination.pageSize   
        getList()
      }


	const getList = async()=>{
		setLoading(true)
		let res = await explainPostList(params)
		setSelectedRows(res.data.data)
		setPagination({
			total:res.data.pagenation.total,
			pageSize:res.data.pagenation.page_size,
			current: params.page,
		}) 
		setLoading(false)
	}

	const handleSubmit = async()=>{
		console.log(currentRow)
		try {
			const values = await form.validateFields();
			console.log('Success:', values);
			handleModalVisible(false)
			save(values)
		} catch (errorInfo) {
			console.log('Failed:', errorInfo);
		}
	}

	const add = ()=>{
		handleModalVisible(true);
		// setCurrentRow({
		// 	title: '',
		// 	images: '',
		// 	author: '',
		// 	explain_category_id: 0,
		// 	explain_kind: 0,
		// 	description: '',
		// 	content: '',
		// });
		form.resetFields()
		
	}

	const save = async(item:ExplainPostItem)=>{
		console.log(item)
		const hide = message.loading('正在提交');
		try {
			item.id = currentRow?.id
			const res = await explainPostAdd(item);
			if(res.status!==0)throw new Error(res.message)
			hide();
			message.success('保存成功');
			getList()
		} catch (error) {
			hide();
			message.error('保存失败请重试！'+error.message);
		}
	}

	const del = async(item:ExplainPostItem)=>{
		console.log(item)
		try {
			const res = await explainPostDelete(item.id||0);
			if(res.status!==0)throw new Error(res.message)
			message.success('操作成功');
			getList()
		} catch (error) {
			message.error('操作失败请重试！'+error.message);
		}
	}


	const columns = [
		{
			title: '标题',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: '讲解分类',
			dataIndex: 'explain_category_name',
			key: 'explain_category_name'
		},
		{
			title: '讲解种类',
			dataIndex: 'explain_kind',
			key: 'explain_kind',
			render: (_:any, record:any)=>(
				record.explain_kind===1?'病例':
				record.explain_kind===2?'病因/病程':
				record.explain_kind===3?'优势':
				record.explain_kind===4?'案例':'其他'
			)
		},
		{
			title: '发布时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render:(_:any, record:any)=>(
				record.create_time.replace(/T|\+08:00/g,' ')
			)
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (_:any, record:any)=>(
				record.status==0?'使用中':'禁用'
			)
		},
		{
			title: '操作',
			dataIndex: 'status',
			key: 'status',
			render: (_:any, record:any)=> (
				<Space size="middle">
					<a onClick={() => {
							handleModalVisible(true);
							setCurrentRow(record);
							// setCurrentRow(prevCurrentRow=>([...prevCurrentRow,...record]));
							// useEffect(() => {
							// 	console.log(currentRow,record)
							// }, [currentRow]);

							console.log(record,currentRow)
						}}>编辑</a>
					<Popconfirm title="确定删除本条数据吗？" onConfirm={()=>{del(record)}} okText="是" cancelText="否">
						<a>删除</a>
					</Popconfirm>
				</Space>
			)
		},
	];

  return (
    <div>
		<Card size="small" style={{ width: '100%',marginBottom:16 }}>
			<Form layout="inline"
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={()=>{

				}}
				>
				<Form.Item name="position" label="位置">
					<Select showSearch allowClear style={{ width: 200 }}>
						<Option value="头部banner">头部banner</Option>
					</Select>
				</Form.Item>
				<Form.Item name="status" label="状态">
					<Select showSearch allowClear style={{ width: 200 }}>
						<Option value="1">禁用</Option>
						<Option value="0">启用</Option>
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">搜索</Button>
				</Form.Item>
				<Form.Item style={{flex:1,textAlign:'right'}}>
					<Button type="primary" onClick={add}  loading={loading} style={{marginLeft:'3px'}}>
						<PlusOutlined />
						新增
					</Button>
				</Form.Item>
			</Form>
		</Card>

		<Table 
			size="small"
			dataSource={selectedRowsState} 
			columns={columns} 
			rowKey="id"
			loading={loading} 
			pagination={pagination}
			onChange={handleTableChange} 
		/> 

		{updateModalVisible && <Modal title="新增" visible={updateModalVisible} destroyOnClose={true} maskClosable={false} onOk={handleSubmit} onCancel={()=>{handleModalVisible(false)}}>
			<Form
				form={form}
				name="control-ref"
				initialValues={currentRow}
				onFinish={()=>{

				}}
				>
				<Form.Item
					label="标题"
					name="title"
					rules={[{ required: true, message: '请输入标题!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="题图"
					name="images"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="作者"
					name="author"
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="分类"
					name="explain_category_id"
					rules={[{ required: true, message: '请输入分类!' }]}
				>
					<Select showSearch allowClear>
						<Option value="头部banner">头部banner</Option>
					</Select>
				</Form.Item>

				<Form.Item
					label="项目"
					name="explain_kind"
					rules={[{ required: true, message: '请选择项目!' }]}
				>
					<Select showSearch allowClear>
						<Option value={1}>病理</Option>
						<Option value={2}>病因/病程</Option>
						<Option value={3}>优势</Option>
						<Option value={4}>案例</Option>
					</Select>
				</Form.Item>
				<Form.Item
					label="描述"
					name="description"
					rules={[{ required: true, message: '请输入描述!' }]}
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item
					label="内容"
					name="content"
					rules={[{ required: true, message: '请输入内容!' }]}
				>
					<Input.TextArea />
				</Form.Item>
			</Form>
		</Modal>}
          
    </div>
  );
};

export default ExplainPost;
