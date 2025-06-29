'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Checkbox,
  TableSortLabel,
  TablePagination
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';

interface Order {
  id: string;
  orderNumber: string;
  containerNumber: string;    // 柜号
  customer: string;
  customerPhone: string;
  customerEmail: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  // 海运信息
  destinationPort: string;    // 目的港
  etd: string;               // 预计离港时间 (Estimated Time of Departure)
  eta: string;               // 预计到港时间 (Estimated Time of Arrival)
  // 派送信息 (客户填写)
  deliveryAddress?: string;   // 派送地址
  deliveryContact?: string;   // 派送联系人
  deliveryPhone?: string;     // 派送联系电话
  specialRequirements?: string; // 特殊要求
  // 文件信息
  packingListFile?: {
    name: string;
    url: string;
    uploadedAt: string;
  };
  billOfLadingFile?: {
    name: string;
    url: string;
    uploadedAt: string;
  };
  // 抓取的产品信息
  extractedProducts: ExtractedProduct[];
  // 审查信息
  reviewInfo?: {
    reviewedBy: string;
    reviewedAt: string;
    reviewComments?: string;
    rejectionReason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ExtractedProduct {
  id: string;
  productName: string;        // 产品品名
  unitPrice: number;          // 单价
  hsCode: string;             // HS CODE
  quantity: number;           // 件数
  containerCount: number;     // 箱数
  unitWeight: number;         // 单件重量(kg)
  containerWeight: number;    // 单箱重量(kg)
  totalWeight: number;        // 货物总重(kg)
}

const statusLabels = {
  draft: '草稿',
  submitted: '已提交',
  under_review: '审查中',
  approved: '审查通过',
  rejected: '审查驳回'
};

const statusColors = {
  draft: 'default',
  submitted: 'info',
  under_review: 'warning',
  approved: 'success',
  rejected: 'error'
} as const;

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    containerNumber: 'MSKU7654321',
    customer: '张三',
    customerPhone: '13800138000',
    customerEmail: 'zhangsan@example.com',
    status: 'submitted',
    destinationPort: '洛杉矶港',
    etd: '2024-02-15',
    eta: '2024-03-01',
    deliveryAddress: '广东省深圳市南山区科技园南区深南大道9988号',
    deliveryContact: '张三',
    deliveryPhone: '13800138000',
    specialRequirements: '需要提前电话预约，工作日9-18点配送',
    packingListFile: {
      name: '装箱单_ORD-2024-001.pdf',
      url: '/files/packing_list_001.pdf',
      uploadedAt: '2024-01-15 10:30:00'
    },
    billOfLadingFile: {
      name: '提单_ORD-2024-001.pdf',
      url: '/files/bill_of_lading_001.pdf',
      uploadedAt: '2024-01-15 10:32:00'
    },
    extractedProducts: [
      {
        id: '1',
        productName: '电子产品配件',
        unitPrice: 25.50,
        hsCode: '8517.70.00',
        quantity: 1000,
        containerCount: 2,
        unitWeight: 0.5,
        containerWeight: 250,
        totalWeight: 500
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    containerNumber: 'TCLU9876543',
    customer: '李四',
    customerPhone: '13900139000',
    customerEmail: 'lisi@example.com',
    status: 'under_review',
    destinationPort: '纽约港',
    etd: '2024-02-20',
    eta: '2024-03-05',
    deliveryAddress: '上海市浦东新区陆家嘴金融贸易区世纪大道100号',
    deliveryContact: '李四',
    deliveryPhone: '13900139000',
    specialRequirements: '货物较重，需要叉车卸货',
    packingListFile: {
      name: '装箱单_ORD-2024-002.pdf',
      url: '/files/packing_list_002.pdf',
      uploadedAt: '2024-01-14 14:20:00'
    },
    billOfLadingFile: {
      name: '提单_ORD-2024-002.pdf',
      url: '/files/bill_of_lading_002.pdf',
      uploadedAt: '2024-01-14 14:25:00'
    },
    extractedProducts: [
      {
        id: '2',
        productName: '纺织品',
        unitPrice: 15.80,
        hsCode: '6204.62.00',
        quantity: 2000,
        containerCount: 3,
        unitWeight: 0.3,
        containerWeight: 200,
        totalWeight: 600
      }
    ],
    createdAt: '2024-01-14',
    updatedAt: '2024-01-16'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    containerNumber: 'HJMU1234567',
    customer: '王五',
    customerPhone: '13700137000',
    customerEmail: 'wangwu@example.com',
    status: 'approved',
    destinationPort: '汉堡港',
    etd: '2024-02-10',
    eta: '2024-02-25',
    deliveryAddress: '北京市朝阳区建国门外大街1号国贸大厦',
    deliveryContact: '王五',
    deliveryPhone: '13700137000',
    specialRequirements: '精密设备，需要防震包装',
    packingListFile: {
      name: '装箱单_ORD-2024-003.pdf',
      url: '/files/packing_list_003.pdf',
      uploadedAt: '2024-01-10 09:15:00'
    },
    billOfLadingFile: {
      name: '提单_ORD-2024-003.pdf',
      url: '/files/bill_of_lading_003.pdf',
      uploadedAt: '2024-01-10 09:18:00'
    },
    extractedProducts: [
      {
        id: '3',
        productName: '机械零件',
        unitPrice: 45.20,
        hsCode: '8483.10.00',
        quantity: 500,
        containerCount: 1,
        unitWeight: 2.5,
        containerWeight: 1250,
        totalWeight: 1250
      }
    ],
    reviewInfo: {
      reviewedBy: '审查员001',
      reviewedAt: '2024-01-12 16:30:00',
      reviewComments: '文件齐全，信息准确，审查通过。'
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    containerNumber: 'COSCO8765432',
    customer: '赵六',
    customerPhone: '13600136000',
    customerEmail: 'zhaoliu@example.com',
    status: 'rejected',
    destinationPort: '鹿特丹港',
    etd: '2024-02-25',
    eta: '2024-03-10',
    deliveryAddress: '广州市天河区珠江新城花城大道85号',
    deliveryContact: '赵六',
    deliveryPhone: '13600136000',
    specialRequirements: '化工产品，需要专业运输资质',
    packingListFile: {
      name: '装箱单_ORD-2024-004.pdf',
      url: '/files/packing_list_004.pdf',
      uploadedAt: '2024-01-08 11:45:00'
    },
    extractedProducts: [
      {
        id: '4',
        productName: '化工原料',
        unitPrice: 120.00,
        hsCode: '2902.20.00',
        quantity: 100,
        containerCount: 1,
        unitWeight: 25.0,
        containerWeight: 2500,
        totalWeight: 2500
      }
    ],
    reviewInfo: {
      reviewedBy: '审查员002',
      reviewedAt: '2024-01-09 14:20:00',
      rejectionReason: '缺少提单文件，HS编码与产品描述不符，请重新提交。'
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-09'
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [containerFilter, setContainerFilter] = useState('');
  const [destinationPortFilter, setDestinationPortFilter] = useState('');
  const [etdFilter, setEtdFilter] = useState<{start: string, end: string}>({start: '', end: ''});
  const [etaFilter, setEtaFilter] = useState<{start: string, end: string}>({start: '', end: ''});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // 排序和分页状态
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // 批量选择状态
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search) ||
      order.containerNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.destinationPort.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesContainer = containerFilter === '' || order.containerNumber.toLowerCase().includes(containerFilter.toLowerCase());
    const matchesDestinationPort = destinationPortFilter === '' || order.destinationPort.toLowerCase().includes(destinationPortFilter.toLowerCase());
    const matchesEtd = (etdFilter.start === '' && etdFilter.end === '') || 
      (etdFilter.start !== '' && etdFilter.end !== '' ? 
        order.etd >= etdFilter.start && order.etd <= etdFilter.end :
        etdFilter.start !== '' ? order.etd >= etdFilter.start :
        order.etd <= etdFilter.end);
    const matchesEta = (etaFilter.start === '' && etaFilter.end === '') || 
      (etaFilter.start !== '' && etaFilter.end !== '' ? 
        order.eta >= etaFilter.start && order.eta <= etaFilter.end :
        etaFilter.start !== '' ? order.eta >= etaFilter.start :
        order.eta <= etaFilter.end);
    
    return matchesSearch && matchesStatus && matchesContainer && matchesDestinationPort && matchesEtd && matchesEta;
  });

  // 排序订单
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortBy) return 0;
    
    let aValue: string | number = a[sortBy as keyof Order] as string | number;
    let bValue: string | number = b[sortBy as keyof Order] as string | number;
    
    // 处理日期排序
    if (sortBy === 'createdAt' || sortBy === 'etd' || sortBy === 'eta') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 分页订单
  const paginatedOrders = sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // 排序处理函数
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // 批量选择处理函数
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
      setSelectAll(false);
    }
  };

  // 批量操作函数
  const handleBatchStatusChange = (newStatus: string) => {
    setOrders(orders.map(order => 
      selectedOrders.includes(order.id) 
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
    setSelectedOrders([]);
    setSelectAll(false);
  };

  // 处理查看订单
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode('view');
    setOpenDialog(true);
  };

  // 处理编辑订单
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  // 处理删除订单
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('确定要删除这个订单吗？')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // 处理审查通过
  const handleApproveOrder = (orderId: string) => {
    const reviewComments = window.prompt('请输入审查意见（可选）：');
    if (reviewComments !== null) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              status: 'approved' as const,
              reviewInfo: {
                reviewedBy: '当前审查员',
                reviewedAt: new Date().toLocaleString('zh-CN'),
                reviewComments: reviewComments || '审查通过'
              },
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : order
      ));
    }
  };

  // 处理审查驳回
  const handleRejectOrder = (orderId: string) => {
    const rejectionReason = window.prompt('请输入驳回原因（必填）：');
    if (rejectionReason && rejectionReason.trim()) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              status: 'rejected' as const,
              reviewInfo: {
                reviewedBy: '当前审查员',
                reviewedAt: new Date().toLocaleString('zh-CN'),
                rejectionReason: rejectionReason.trim()
              },
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : order
      ));
    } else if (rejectionReason !== null) {
      alert('驳回原因不能为空！');
    }
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      p: { xs: 2, md: 4 }
    }}>
      {/* 页面标题区域 */}
      <Box sx={{ 
        mb: 4,
        pb: 3,
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          订单管理系统
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b',
            fontSize: '1rem'
          }}
        >
          高效管理您的海运订单，实时跟踪订单状态
        </Typography>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            border: 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: 0.9,
                mb: 2
              }}>
                总订单数
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1
              }}>
                {orders.length}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                全部订单统计
              </Typography>
            </CardContent>
          </Card>
        </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
            border: 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: 0.9,
                mb: 2
              }}>
                待审查
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1
              }}>
                {orders.filter(o => o.status === 'submitted' || o.status === 'under_review').length}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                需要处理的订单
              </Typography>
            </CardContent>
          </Card>
        </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
            border: 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(79, 172, 254, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: 0.9,
                mb: 2
              }}>
                审查通过
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1
              }}>
                {orders.filter(o => o.status === 'approved').length}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                已完成审查
              </Typography>
            </CardContent>
          </Card>
        </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(250, 112, 154, 0.3)',
            border: 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(250, 112, 154, 0.4)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                opacity: 0.9,
                mb: 2
              }}>
                审查驳回
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                mb: 1
              }}>
                {orders.filter(o => o.status === 'rejected').length}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                需要重新处理
              </Typography>
            </CardContent>
          </Card>
        </Grid>
       </Grid>

      {/* 搜索和筛选栏 */}
      <Card sx={{ 
        mb: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontWeight: 600,
            color: '#1e293b'
          }}>
            搜索与筛选
          </Typography>
          {/* 搜索筛选区域 - 优化布局 */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 3
          }}>
            {/* 主搜索框 */}
            <Box sx={{ gridColumn: { xs: '1', md: '1 / 3' } }}>
              <TextField
                label="搜索订单号/客户/电话/柜号/目的港"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                fullWidth
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#64748b' }} />
                }}
              />
            </Box>

            {/* 状态筛选 */}
            <FormControl size="small" fullWidth sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }
              }
            }}>
              <InputLabel>状态筛选</InputLabel>
              <Select
                value={statusFilter}
                label="状态筛选"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">全部状态</MenuItem>
                <MenuItem value="draft">草稿</MenuItem>
                <MenuItem value="submitted">已提交</MenuItem>
                <MenuItem value="under_review">审查中</MenuItem>
                <MenuItem value="approved">审查通过</MenuItem>
                <MenuItem value="rejected">审查驳回</MenuItem>
              </Select>
            </FormControl>

            {/* 柜号筛选 */}
            <TextField
              label="柜号筛选"
              value={containerFilter}
              onChange={(e) => setContainerFilter(e.target.value)}
              size="small"
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }
                }
              }}
            />

            {/* 目的港筛选 */}
            <TextField
              label="目的港筛选"
              value={destinationPortFilter}
              onChange={(e) => setDestinationPortFilter(e.target.value)}
              size="small"
              fullWidth
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }
                }
              }}
            />
          </Box>

          {/* 日期筛选区域 */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 3,
            mb: 3
          }}>
            {/* ETD筛选 */}
            <Box sx={{ 
              p: 3,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#475569',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📅 ETD筛选
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
                gap: 2,
                alignItems: 'center'
              }}>
                <TextField
                  label="开始日期"
                  type="date"
                  value={etdFilter.start}
                  onChange={(e) => setEtdFilter({...etdFilter, start: e.target.value})}
                  size="small"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 500,
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  至
                </Typography>
                <TextField
                  label="结束日期"
                  type="date"
                  value={etdFilter.end}
                  onChange={(e) => setEtdFilter({...etdFilter, end: e.target.value})}
                  size="small"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            {/* ETA筛选 */}
            <Box sx={{ 
              p: 3,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#475569',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🚢 ETA筛选
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
                gap: 2,
                alignItems: 'center'
              }}>
                <TextField
                  label="开始日期"
                  type="date"
                  value={etaFilter.start}
                  onChange={(e) => setEtaFilter({...etaFilter, start: e.target.value})}
                  size="small"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 500,
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  至
                </Typography>
                <TextField
                  label="结束日期"
                  type="date"
                  value={etaFilter.end}
                  onChange={(e) => setEtaFilter({...etaFilter, end: e.target.value})}
                  size="small"
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 操作按钮区域 */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/orders/new')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          新增订单
        </Button>
        
        {selectedOrders.length > 0 && (
          <>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              已选择 {selectedOrders.length} 个订单
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>批量操作</InputLabel>
              <Select
                label="批量操作"
                onChange={(e) => handleBatchStatusChange(e.target.value)}
                value=""
              >
                <MenuItem value="submitted">标记为已提交</MenuItem>
                <MenuItem value="under_review">标记为审查中</MenuItem>
                <MenuItem value="approved">标记为审查通过</MenuItem>
                <MenuItem value="rejected">标记为审查驳回</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      {/* 订单表格 */}
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        borderRadius: 2
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < paginatedOrders.length}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'orderNumber'}
                    direction={sortBy === 'orderNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('orderNumber')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    订单号
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'containerNumber'}
                    direction={sortBy === 'containerNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('containerNumber')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    柜号
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'customer'}
                    direction={sortBy === 'customer' ? sortOrder : 'asc'}
                    onClick={() => handleSort('customer')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    客户
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>派送地址</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'destinationPort'}
                    direction={sortBy === 'destinationPort' ? sortOrder : 'asc'}
                    onClick={() => handleSort('destinationPort')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    目的港
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'etd'}
                    direction={sortBy === 'etd' ? sortOrder : 'asc'}
                    onClick={() => handleSort('etd')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    ETD
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'eta'}
                    direction={sortBy === 'eta' ? sortOrder : 'asc'}
                    onClick={() => handleSort('eta')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    ETA
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    状态
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'createdAt'}
                    direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                    onClick={() => handleSort('createdAt')}
                    sx={{ fontWeight: 600, color: '#374151' }}
                  >
                    创建时间
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f8fafc',
                      transition: 'background-color 0.2s ease'
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {order.containerNumber}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                        {order.customer}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {order.customerPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#1e293b' }}>
                        {order.deliveryAddress || '未填写'}
                      </Typography>
                      {order.deliveryContact && (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {order.deliveryContact} {order.deliveryPhone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {order.destinationPort}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {order.etd}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {order.eta}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[order.status]}
                      color={statusColors[order.status]}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        borderRadius: 1.5
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {order.createdAt}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="查看详情">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewOrder(order)}
                          sx={{ 
                            color: '#3b82f6',
                            '&:hover': { 
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="编辑">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditOrder(order)}
                          sx={{ 
                            color: '#f59e0b',
                            '&:hover': { 
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {(order.status === 'submitted' || order.status === 'under_review') && (
                        <>
                          <Tooltip title="审查通过">
                            <IconButton 
                              size="small" 
                              onClick={() => handleApproveOrder(order.id)}
                              sx={{ 
                                color: '#10b981',
                                '&:hover': { 
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="审查驳回">
                            <IconButton 
                              size="small" 
                              onClick={() => handleRejectOrder(order.id)}
                              sx={{ 
                                color: '#ef4444',
                                '&:hover': { 
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="删除">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteOrder(order.id)}
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': { 
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* 分页 */}
        <TablePagination
          component="div"
          count={sortedOrders.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="每页显示："
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count} 条`}
          sx={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}
        />
      </Card>

      {/* 订单详情对话框 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          fontWeight: 600
        }}>
          {dialogMode === 'view' ? '订单详情' : '编辑订单'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>基本信息</Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>订单号：</strong>{selectedOrder.orderNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>柜号：</strong>{selectedOrder.containerNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>客户：</strong>{selectedOrder.customer}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>电话：</strong>{selectedOrder.customerPhone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>邮箱：</strong>{selectedOrder.customerEmail}
                    </Typography>
                  </Box>
                </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>海运信息</Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>目的港：</strong>{selectedOrder.destinationPort}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>ETD：</strong>{selectedOrder.etd}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>ETA：</strong>{selectedOrder.eta}
                    </Typography>
                    <Typography variant="body2">
                      <strong>状态：</strong>
                      <Chip
                        label={statusLabels[selectedOrder.status]}
                        color={statusColors[selectedOrder.status]}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Grid>
          <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>派送信息</Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>派送地址：</strong>{selectedOrder.deliveryAddress || '未填写'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>派送联系人：</strong>{selectedOrder.deliveryContact || '未填写'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>派送联系电话：</strong>{selectedOrder.deliveryPhone || '未填写'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>特殊要求：</strong>{selectedOrder.specialRequirements || '无'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>产品信息</Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>产品品名</TableCell>
                          <TableCell>单价</TableCell>
                          <TableCell>HS CODE</TableCell>
                          <TableCell>件数</TableCell>
                          <TableCell>箱数</TableCell>
                          <TableCell>单件重量(kg)</TableCell>
                          <TableCell>总重量(kg)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.extractedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>${product.unitPrice}</TableCell>
                            <TableCell>{product.hsCode}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{product.containerCount}</TableCell>
                            <TableCell>{product.unitWeight}</TableCell>
                            <TableCell>{product.totalWeight}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {selectedOrder.reviewInfo && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>审查信息</Typography>
                    <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>审查员：</strong>{selectedOrder.reviewInfo.reviewedBy}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>审查时间：</strong>{selectedOrder.reviewInfo.reviewedAt}
                      </Typography>
                      {selectedOrder.reviewInfo.reviewComments && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>审查意见：</strong>{selectedOrder.reviewInfo.reviewComments}
                        </Typography>
                      )}
                      {selectedOrder.reviewInfo.rejectionReason && (
                        <Typography variant="body2" sx={{ color: '#ef4444' }}>
                          <strong>驳回原因：</strong>{selectedOrder.reviewInfo.rejectionReason}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            关闭
          </Button>
          {dialogMode === 'edit' && (
            <Button variant="contained" sx={{ ml: 2 }}>
              保存修改
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}