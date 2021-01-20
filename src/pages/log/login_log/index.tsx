import { Table, Button, Modal,Form, Input, Select,Card, DatePicker  } from 'antd';
import React, { useState, useEffect } from 'react';
import type { LoginLogTypes,LoginLogPagination,LoginLogParams } from './data.d';
import { loginLogForm,loginLogParams,loginLogList } from './service';
import { cloneDeep } from "lodash";
const { Option } = Select;
const { RangePicker } = DatePicker;
import { PageContainer } from '@ant-design/pro-layout';


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
			key: 'id'
		},
		{
			title: '类型',
			dataIndex: 'login_type',
			key: 'login_type',
			render:(_:any, record:any)=>(
				record.type===0?'前台登录':record.type===1?'后台登录':record.type===2?'HTTP请求':'未知'
			)
		},
		{
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render:(_:any, record:any)=>(
				record.create_time.replace(/T|\+08:00/g,' ')
			)
		},
		{
			title: 'IP',
			dataIndex: 'source_ip',
			key: 'source_ip'
		},
		{
			title: '系统',
			dataIndex: 'user_agent',
			key: 'user_agent'
		},
		{
			title: '用户',
			dataIndex: 'user_name',
			key: 'user_name'
		},
		{
			title: '内容',
			dataIndex: 'content',
			key: 'content'
		}
	];

  return (<PageContainer><Card size="small" hoverable style={{ width: '100%',marginBottom:16 }}>
			<Form layout="inline"
				name="advanced_search"
				className="ant-advanced-search-form"
				style={{ marginBottom:15 }}
				onFinish={(values)=>{
					params = Object.assign({},params,values,{page:1})
					getList()
				}}
				>
				<Form.Item name="user_name" label="登录用户">
					<Input allowClear />
				</Form.Item>
				<Form.Item name="type" label="登录类型">
					<Select showSearch allowClear style={{ width: 180 }}>
						<Option value="0">前台登陆</Option>
						<Option value="1">后台登陆</Option>
					</Select>
				</Form.Item>
				<Form.Item name="source_ip" label="登录IP">
					<Input allowClear />
				</Form.Item>
				<Form.Item label="登录时间">
					<RangePicker format={'YYYY-MM-DD'} onChange={changeDate} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">搜索</Button>
				</Form.Item>
			</Form>

		<Table 
			size="small"
			bordered
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
	</Card>
	</PageContainer>
  );
};

export default LoginLog;
