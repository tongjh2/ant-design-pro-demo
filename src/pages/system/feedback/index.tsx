import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, message, Space, Popconfirm, Modal,Form, Input, Select,Card,Upload, DatePicker  } from 'antd';
import React, { useState, useEffect } from 'react';
import type { FeedbackTypes,FeedbackPagination,FeedbackParams } from './data.d';
import { feedbackForm,feedbackParams,feedbackList, feedbackUpdateStatus, feedbackAdd, feedbackDelete } from './service';
import { commDataList } from '../../base/comm_data/service';
import { CommDataParams } from '../../base/comm_data/data.d';
import { cloneDeep } from "lodash";
const { Option } = Select;
const { RangePicker } = DatePicker;
import EditorDemo from '@/components/EditorDemo'


const Feedback: React.FC = () => {

  const [modalVisible, handleModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<FeedbackTypes>(cloneDeep(feedbackForm));
  const [selectedRowsState, setSelectedRows] = useState<FeedbackTypes[]>([]);
  const [pagination, setPagination] = useState<FeedbackPagination>();


  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
   	  
	const [form] = Form.useForm();


  	useEffect(()=>{
		console.log("第一次渲染");
		getList() 
	},[])

	let params:FeedbackParams = cloneDeep(feedbackParams)

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
		let res = await feedbackList(params)
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
			title: '用户',
			dataIndex: 'user_name',
			key: 'user_name',
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
			title: '反馈内容',
			dataIndex: 'content',
			key: 'content'
		},
		{
			title: '操作',
			dataIndex: 'status',
			key: 'status',
			render: (_:any, record:any)=> (
				<Space size="middle">
					<a onClick={() => {
							setCurrentRow(record);
							handleModalVisible(true);
							form.setFieldsValue(record);							
						}}>查看</a>
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
				onFinish={(values)=>{
					params = Object.assign({},params,values,{page:1})
					getList()
				}}
				>
				<Form.Item name="q" label="反馈内容">
					<Input allowClear />
				</Form.Item>
				<Form.Item label="发布时间">
					<RangePicker format={'YYYY-MM-DD'} onChange={changeDate} />
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
				>
					<Form.Item name="image">
					{currentRow.image && <div className="image-items">
						{currentRow.image.split(',').map((v:string,index:number)=>(
							<div className="item-image" key={index}><img src={v} onClick={()=>{
								setPreviewVisible(true)
								setPreviewImage(v)
							}} /></div>
						))}
					</div>}
					</Form.Item>
					
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

export default Feedback;
