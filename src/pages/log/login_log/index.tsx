import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, message, Space, Popconfirm, Modal,Form, Input, Select,Card,Upload, DatePicker  } from 'antd';
import React, { useState, useEffect } from 'react';
import type { LoginLogTypes,LoginLogPagination,LoginLogParams } from './data.d';
import { loginLogForm,loginLogParams,loginLogList, loginLogUpdateStatus, loginLogAdd, loginLogDelete } from './service';
import { commDataList } from '../../base/comm_data/service';
import { CommDataParams } from '../../base/comm_data/data.d';
import { cloneDeep } from "lodash";
const { Option } = Select;
const { RangePicker } = DatePicker;
import EditorDemo from '@/components/EditorDemo'


const LoginLog: React.FC = () => {

  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<LoginLogTypes>(cloneDeep(loginLogForm));
  const [selectedRowsState, setSelectedRows] = useState<LoginLogTypes[]>([]);
  const [pagination, setPagination] = useState<LoginLogPagination>();


  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
   	  
	const [form] = Form.useForm();


  	useEffect(()=>{
		console.log("第一次渲染");
		getList() 
	},[])

	let params:LoginLogParams = cloneDeep(loginLogParams)

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
		let res = await loginLogList(params)
		setSelectedRows(res.data.data)
		setPagination({
			total:res.data.pagenation.total,
			pageSize:res.data.pagenation.page_size,
			current: params.page,
		}) 
		setLoading(false)
	}

	const changeDate = (e:any,date:string[])=>{
		params.start_time = date[0];
		params.end_time = date[1];
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 90
		},
		{
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
			width: 150,
			render:(_:any, record:any)=>(
				record.create_time.replace(/T|\+08:00/g,' ')
			)
		},
		{
			title: '用户',
			dataIndex: 'user_name',
			key: 'user_name',
			width: 100
		},
		{
			title: '内容',
			dataIndex: 'content',
			key: 'content'
		}
	];

  return (
    <div>
		<Card size="small" style={{ width: '100%',marginBottom:16 }}>
			<Form layout="inline"
				name="advanced_search"
				className="ant-advanced-search-form"
				onFinish={(values)=>{
					console.log(values)
					params = Object.assign({},params,values,{page:1})
					console.log(params)
					getList()
				}}
				>
				<Form.Item name="user_name" label="用户">
					<Input allowClear />
				</Form.Item>
				<Form.Item name="q" label="内容">
					<Input allowClear />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">搜索</Button>
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

		{modalVisible && <Modal title="查看" visible={modalVisible} destroyOnClose={true} footer={false} onCancel={()=>{handleModalVisible(false)}} width="600px">
			<Form
				form={form}
				name="control-ref"
				initialValues={currentRow}
				>
				<Form.Item
					label="用户"
					name="user_name"					
				>
					<Input readOnly />
				</Form.Item>
				<Form.Item
					label="发布时间"
					name="create_time"
				>
					<Input readOnly />
				</Form.Item>
				<Form.Item
					label="反馈内容"
					name="content"
				>
					<Input.TextArea readOnly />
				</Form.Item>
				<Form.Item
					label="图片附件"
					name="image"
				>
					{currentRow.image && <div className="image-items">
						{currentRow.image.split(',').map((v:string)=>(
							<div className="item-image"><img src={v} key={v} onClick={()=>{
								setPreviewVisible(true)
								setPreviewImage(v)
							}} /></div>
						))}
					</div>}
					
					<Modal
					visible={previewVisible}
					title="图片查看"
					width="1000px"
					footer={null}
					onCancel={()=>{
						setPreviewVisible(false)
					}}
					>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
					</Modal>
				</Form.Item>				
			</Form>
		</Modal>}
          
    </div>
  );
};

export default LoginLog;
