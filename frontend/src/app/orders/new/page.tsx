'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CloudUpload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Save as SaveIcon,
  BookmarkBorder as AddressBookIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AddressBook, { AddressInfo } from './AddressBook';

interface ProductInfo {
  id: string;
  productName: string;
  unitPrice: number;
  hsCode: string;
  quantity: number;
  containerCount: number;
  unitWeight: number;
  containerWeight: number;
  totalWeight: number;
}

interface OrderForm {
  customer: string;
  customerPhone: string;
  customerEmail: string;
  containerNumber: string;    // 柜号
  destinationPort: string;    // 目的港
  etd: string;               // 预计离港时间
  eta: string;               // 预计到港时间
  deliveryAddress: string;    // 派送地址
  deliveryCompany: string;    // 收件公司名称
  deliveryContact: string;    // 派送联系人
  deliveryPhone: string;      // 派送联系电话
  specialRequirements: string; // 特殊要求
  products: ProductInfo[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function NewOrderPage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  
  // 文件上传状态
  const [packingListFile, setPackingListFile] = useState<File | null>(null);
  const [billOfLadingFile, setBillOfLadingFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState<'packing' | 'bill' | null>(null);
  
  // 地址簿相关状态
  const [addressBookOpen, setAddressBookOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // 手动填写表单状态
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customer: '',
    customerPhone: '',
    customerEmail: '',
    containerNumber: '',
    destinationPort: '',
    etd: '',
    eta: '',
    deliveryAddress: '',
    deliveryCompany: '',
    deliveryContact: '',
    deliveryPhone: '',
    specialRequirements: '',
    products: [{
      id: '1',
      productName: '',
      unitPrice: 0,
      hsCode: '',
      quantity: 0,
      containerCount: 0,
      unitWeight: 0,
      containerWeight: 0,
      totalWeight: 0
    }]
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 文件拖拽处理
  const handleDragOver = (e: React.DragEvent, type: 'packing' | 'bill') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'packing' | 'bill') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (type === 'packing') {
        setPackingListFile(file);
      } else {
        setBillOfLadingFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'packing' | 'bill') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (type === 'packing') {
        setPackingListFile(file);
      } else {
        setBillOfLadingFile(file);
      }
    }
  };

  // 手动填写表单处理
  const handleFormChange = (field: keyof OrderForm, value: string | number | ProductInfo[]) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index: number, field: keyof ProductInfo, value: string | number) => {
    const updatedProducts = [...orderForm.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    
    // 自动计算总重量
    if (field === 'quantity' || field === 'unitWeight') {
      updatedProducts[index].totalWeight = updatedProducts[index].quantity * updatedProducts[index].unitWeight;
    }
    
    setOrderForm(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const addProduct = () => {
    const newProduct: ProductInfo = {
      id: Date.now().toString(),
      productName: '',
      unitPrice: 0,
      hsCode: '',
      quantity: 0,
      containerCount: 0,
      unitWeight: 0,
      containerWeight: 0,
      totalWeight: 0
    };
    
    setOrderForm(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const removeProduct = (index: number) => {
    if (orderForm.products.length > 1) {
      const updatedProducts = orderForm.products.filter((_, i) => i !== index);
      setOrderForm(prev => ({
        ...prev,
        products: updatedProducts
      }));
    }
  };

  // 地址簿相关处理函数
  const handleSelectAddress = (address: AddressInfo) => {
    setOrderForm(prev => ({
      ...prev,
      deliveryAddress: address.address,
      deliveryCompany: address.company,
      deliveryContact: address.contact,
      deliveryPhone: address.phone
    }));
    setSnackbarMessage(`已选择地址：${address.name}`);
    setSnackbarOpen(true);
  };

  const handleSaveToAddressBook = () => {
    // 检查是否填写了必要的派送信息
    if (!orderForm.deliveryAddress || !orderForm.deliveryContact || !orderForm.deliveryPhone) {
      setSnackbarMessage('请先填写完整的派送信息');
      setSnackbarOpen(true);
      return;
    }
    
    setSnackbarMessage('派送信息已保存到地址簿');
    setSnackbarOpen(true);
  };

  const handleOpenAddressBook = () => {
    setAddressBookOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = () => {
    if (tabValue === 0) {
      // 文件上传模式
      if (!packingListFile || !billOfLadingFile) {
        alert('请上传装箱单和提单文件');
        return;
      }
      console.log('文件上传模式提交:', { packingListFile, billOfLadingFile });
    } else {
      // 手动填写模式
      if (!orderForm.customer || !orderForm.customerEmail || orderForm.products.some(p => !p.productName || !p.hsCode)) {
        alert('请填写完整的订单信息');
        return;
      }
      console.log('手动填写模式提交:', orderForm);
    }
    
    // 这里应该调用API提交订单
    alert('订单提交成功！');
    router.push('/orders');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 页面标题 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.push('/orders')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          新建订单
        </Typography>
      </Box>

      {/* 选项卡 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="订单创建方式">
          <Tab label="文件上传" {...a11yProps(0)} />
          <Tab label="手动填写" {...a11yProps(1)} />
        </Tabs>
      </Paper>

      {/* 文件上传模式 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
          <Grid container spacing={4} sx={{ maxWidth: 1200 }}>
            {/* 装箱单上传区域 */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
                    装箱单 (Packing List)
                  </Typography>
                  <Box
                    sx={{
                      border: '3px dashed',
                      borderColor: dragOver === 'packing' ? 'primary.main' : 'grey.300',
                      borderRadius: 3,
                      p: 6,
                      textAlign: 'center',
                      bgcolor: dragOver === 'packing' ? 'primary.50' : 'grey.50',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onDragOver={(e) => handleDragOver(e, 'packing')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'packing')}
                    onClick={() => document.getElementById('packing-file-input')?.click()}
                  >
                    <UploadIcon sx={{ fontSize: 72, color: 'grey.400', mb: 3 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {packingListFile ? packingListFile.name : '拖拽文件到此处或点击上传'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      支持 PDF, Excel, Word 格式
                    </Typography>
                    <input
                      id="packing-file-input"
                      type="file"
                      hidden
                      accept=".pdf,.xlsx,.xls,.doc,.docx"
                      onChange={(e) => handleFileSelect(e, 'packing')}
                    />
                  </Box>
                  {packingListFile && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        装箱单已上传: {packingListFile.name}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid2>

            {/* 提单上传区域 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
                    提单 (Bill of Lading)
                  </Typography>
                  <Box
                    sx={{
                      border: '3px dashed',
                      borderColor: dragOver === 'bill' ? 'primary.main' : 'grey.300',
                      borderRadius: 3,
                      p: 6,
                      textAlign: 'center',
                      bgcolor: dragOver === 'bill' ? 'primary.50' : 'grey.50',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onDragOver={(e) => handleDragOver(e, 'bill')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'bill')}
                    onClick={() => document.getElementById('bill-file-input')?.click()}
                  >
                    <UploadIcon sx={{ fontSize: 72, color: 'grey.400', mb: 3 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {billOfLadingFile ? billOfLadingFile.name : '拖拽文件到此处或点击上传'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      支持 PDF, Excel, Word 格式
                    </Typography>
                    <input
                      id="bill-file-input"
                      type="file"
                      hidden
                      accept=".pdf,.xlsx,.xls,.doc,.docx"
                      onChange={(e) => handleFileSelect(e, 'bill')}
                    />
                  </Box>
                  {billOfLadingFile && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        提单已上传: {billOfLadingFile.name}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        </Box>

        {/* 文件上传说明 */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            上传文件后，系统将自动解析装箱单和提单中的产品信息，包括HS编码、数量、重量等详细信息。
          </Typography>
        </Alert>
      </TabPanel>

      {/* 手动填写模式 */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* 客户信息 */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  客户信息
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="客户姓名"
                      value={orderForm.customer}
                      onChange={(e) => handleFormChange('customer', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="联系电话"
                      value={orderForm.customerPhone}
                      onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="邮箱地址"
                      type="email"
                      value={orderForm.customerEmail}
                      onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  海运信息
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="柜号"
                      value={orderForm.containerNumber}
                      onChange={(e) => handleFormChange('containerNumber', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="目的港"
                      value={orderForm.destinationPort}
                      onChange={(e) => handleFormChange('destinationPort', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="预计离港时间 (ETD)"
                      type="date"
                      value={orderForm.etd}
                      onChange={(e) => handleFormChange('etd', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="预计到港时间 (ETA)"
                      type="date"
                      value={orderForm.eta}
                      onChange={(e) => handleFormChange('eta', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  派送信息
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="收件地址"
                      value={orderForm.deliveryAddress}
                      onChange={(e) => handleFormChange('deliveryAddress', e.target.value)}
                      multiline
                      rows={2}
                      placeholder="请输入详细的收件地址"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="收件公司名称"
                      value={orderForm.deliveryCompany}
                      onChange={(e) => handleFormChange('deliveryCompany', e.target.value)}
                      placeholder="请输入收件公司名称"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="收件联系人"
                      value={orderForm.deliveryContact}
                      onChange={(e) => handleFormChange('deliveryContact', e.target.value)}
                      placeholder="请输入收件联系人姓名"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="收件联系电话"
                      value={orderForm.deliveryPhone}
                      onChange={(e) => handleFormChange('deliveryPhone', e.target.value)}
                      placeholder="请输入收件联系电话"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddressBookIcon />}
                        onClick={handleOpenAddressBook}
                        sx={{ height: '40px' }}
                      >
                        从地址簿选择
                      </Button>
                      <Button
                        variant="text"
                        fullWidth
                        size="small"
                        onClick={handleSaveToAddressBook}
                        sx={{ 
                          height: '32px',
                          fontSize: '0.75rem',
                          color: '#64748b',
                          '&:hover': {
                            backgroundColor: 'rgba(100, 116, 139, 0.1)'
                          }
                        }}
                      >
                        保存到地址簿
                      </Button>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="特殊要求"
                      value={orderForm.specialRequirements}
                      onChange={(e) => handleFormChange('specialRequirements', e.target.value)}
                      multiline
                      rows={2}
                      placeholder="请输入特殊派送要求（可选）"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 产品信息 */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    产品信息
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addProduct}
                  >
                    添加产品
                  </Button>
                </Box>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>产品品名</TableCell>
                        <TableCell>HS编码</TableCell>
                        <TableCell>单价($)</TableCell>
                        <TableCell>件数</TableCell>
                        <TableCell>箱数</TableCell>
                        <TableCell>单件重量(kg)</TableCell>
                        <TableCell>单箱重量(kg)</TableCell>
                        <TableCell>总重量(kg)</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderForm.products.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <TextField
                              size="small"
                              value={product.productName}
                              onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                              placeholder="输入产品名称"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={product.hsCode}
                              onChange={(e) => handleProductChange(index, 'hsCode', e.target.value)}
                              placeholder="如: 8517.70.00"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={product.unitPrice}
                              onChange={(e) => handleProductChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                              inputProps={{ min: 0 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={product.containerCount}
                              onChange={(e) => handleProductChange(index, 'containerCount', parseInt(e.target.value) || 0)}
                              inputProps={{ min: 0 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={product.unitWeight}
                              onChange={(e) => handleProductChange(index, 'unitWeight', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.1 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={product.containerWeight}
                              onChange={(e) => handleProductChange(index, 'containerWeight', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.1 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {product.totalWeight.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeProduct(index)}
                              disabled={orderForm.products.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/orders')}
        >
          取消
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          提交订单
        </Button>
      </Box>
      
      {/* 地址簿对话框 */}
      <AddressBook
        open={addressBookOpen}
        onClose={() => setAddressBookOpen(false)}
        onSelectAddress={handleSelectAddress}
        onSaveAddress={(address) => {
          setSnackbarMessage('地址已保存到地址簿');
          setSnackbarOpen(true);
        }}
      />
      
      {/* 消息提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}