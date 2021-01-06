import { PlusOutlined } from '@ant-design/icons';
import { Button, message,Form, Input, Drawer, Table, Modal,Space  } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { ProductInfoItem } from './data.d';
import { productInfoList, updateRule, saveProductInfo, removeRule } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: ProductInfoItem) => {
  const hide = message.loading('正在添加');
  try {
    await saveProductInfo({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: ProductInfoItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * 新建窗口的弹窗
   */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * 分布更新窗口的弹窗
   */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ProductInfoItem>();
  const [selectedRowsState, setSelectedRows] = useState<ProductInfoItem[]>([]);

  /**
   * 国际化配置
   */
  const intl = useIntl();

  const columns: ProColumns<ProductInfoItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.warehouseInfo.warehouseCode"
          defaultMessage="仓库编码"
        />
      ),
      dataIndex: 'warehouseCode',
      tip: '仓库编码',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.warehouseInfo.warehouseName" defaultMessage="仓库名称" />,
      dataIndex: 'warehouseName',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.warehouseInfo.warehouseBelong" defaultMessage="仓库所属" />,
      dataIndex: 'warehouseBelong',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${val==='1'?'厂内':'厂外'}`,
    },
    {
      title: <FormattedMessage id="pages.warehouseInfo.warehouseState" defaultMessage="仓库状态" />,
      dataIndex: 'warehouseState',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.warehouseInfo.warehouseState0" defaultMessage="未审批" />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.warehouseInfo.warehouseState1" defaultMessage="已审批" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.warehouseInfo.warehouseState2" defaultMessage="禁用申请" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage id="pages.warehouseInfo.warehouseState3" defaultMessage="已禁用" />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.warehouseInfo.warehouseLinkman" defaultMessage="仓库联系人" />,
      dataIndex: 'warehouseLinkman',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="配置" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.searchTable.subscribeAlert" defaultMessage="订阅警报" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProductInfoItem>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询表格',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async(params, sorter, filter) => {
          const res = await queryRule({ ...params, sorter, filter })
          return {
            data: res.list,
            success: true,
            total:res.count
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="服务调用次数总计"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="批量审批" />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: '新建规则',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as ProductInfoItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<ProductInfoItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<ProductInfoItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

// export default TableList;

class productInfoComponent extends React.Component{

    state = {
        form:{id:0},
        params:{
            pageNo:1,
            pageSize:10,
        },
        data: [],
        pagination: {
            total:0,
            current: 1,
            pageSize: 10,
        },
        loading: false,
        isModalVisible: false
    };

    //[isModalVisible, setIsModalVisible] = useState(false);

    // public list:any[] = []

    private formObj:any
    

    constructor(props:any) {
        super(props);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        // const [formObj] = Form.useForm();
        // this.formObj = formObj;
    }

    public componentDidMount() {
        this.getProductInfoList()
    }

    handleTableChange = (pagination:any, filters:any, sorter:any) => {
        console.log({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filters,
        });
        this.state.params.pageNo = pagination.current        
        this.getProductInfoList()
      };

    private async getProductInfoList(){
        this.setState({ loading: true });
        const { params } = this.state;
        let res = await productInfoList(params)
        this.setState({
            loading: false,
            data: res.list,
            pagination: {
                total: res.count,
                current: res.pageNo,
                pageSize: res.pageSize
            }
        })
    }

    public add(){
        this.setState({
            form: {},
            isModalVisible:true
        })

        // this.props.form.resetFields();
        this.formObj.resetFields();

        // if (actionRef.current) {
        //   actionRef.current.reload();
        // }
    }

    public edit(item:any){
        console.log(item)
        this.setState({
            form: Object.assign({}, item),
            isModalVisible:true
        })
    }

    save = async(values:any)=>{
        console.log(values)
        let form = Object.assign({},values)
        form.id = this.state.form.id
        form['parent.id'] = ''
        try {
            const res = await saveProductInfo(form)
            if(res.code===200){
                this.setState({isModalVisible:false})
                message.success('保存成功')
            }else{
                message.error(res.message)
            }
            console.log(res)
        } catch (error) {
            console.log(error)
            
        }
        
    }

    

    public handleOk(values: any){
        // this.setState({isModalVisible:false})
        console.log(values)
    }
    public handleCancel(){
        this.setState({isModalVisible:false})
    }

    public render() {
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
          };

        // const [formObj] = Form.useForm();

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const onFinish = (values: any) => {
            console.log('Success:', values);
          };
        
          const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
          };
          
        const columns = [
            {
                title: '产品编码',
                dataIndex: 'productCode',
                key: 'productCode',
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: '产品种类',
                dataIndex: 'productState',
                key: 'productState',
            },
            {
                title: '操作',
                dataIndex: 'productState',
                key: 'productState',
                render: (_:any, record:any)=> (
                    <Space size="middle">
                        <a onClick={this.edit.bind(this,record)}>编辑</a>
                    </Space>
                )
            },
        ];

        const { form, data, pagination, loading, isModalVisible } = this.state; 
        console.log(pagination)



        return <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.add}  loading={loading}>
                    <PlusOutlined />
                    新增
                </Button>
                <span style={{ marginLeft: 8 }}>               
                </span>
            </div>
             
            <Table 
                dataSource={data} 
                columns={columns} 
                rowKey="id"
                loading={loading} 
                pagination={pagination}
                onChange={this.handleTableChange}
            />

            <Modal title="新增" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form
                    {...layout}
                    name="form"
                    // form={formObj}
                    initialValues={form}
                    onFinish={this.save}
                    onFinishFailed={onFinishFailed}
                    >
                    <Form.Item
                        label="产品编码"
                        name="productCode"
                        rules={[{ required: true, message: '请输入产品编码!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="产品名称"
                        name="productName"
                        rules={[{ required: true, message: '请输入产品名称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="产品种类"
                        name="productKind"
                        rules={[{ required: true, message: '请输入产品种类!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="排序"
                        name="sortVal"
                        rules={[{ required: true, message: '请输入产品排序!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="备注信息"
                        name="remarks"
                        rules={[{ required: true, message: '请输入产品备注信息!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>;
    }



}


export default productInfoComponent