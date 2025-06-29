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
  LocalShipping as DeliveryIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface DeliveryTask {
  id: string;
  orderNumber: string;        // 使用订单号作为唯一标识，实现一单制
  orderId: string;
  customer: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryContact: string;
  deliveryPhone: string;
  truckingCompany?: string;   // 分配的卡车公司
  estimatedDeliveryDate?: string;
  estimatedTimeSlot?: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  specialRequirements?: string;
  assignedAt?: string;        // 分配时间
  createdAt: string;
  updatedAt: string;
}

interface TruckingCompany {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  serviceAreas: string[];
  pricePerKm: number;
  rating: number;
}

const statusLabels = {
  pending: '待分配',
  assigned: '已分配',
  in_transit: '配送中',
  delivered: '已送达',
  cancelled: '已取消'
};

const statusColors = {
  pending: 'warning',
  assigned: 'info',
  in_transit: 'primary',
  delivered: 'success',
  cancelled: 'error'
} as const;

const timeSlots = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00'
];

const mockTruckingCompanies: TruckingCompany[] = [
  {
    id: '1',
    name: '顺丰速运',
    contactPerson: '李经理',
    phone: '400-111-1111',
    email: 'li.manager@sf-express.com',
    serviceAreas: ['北京', '上海', '广州', '深圳'],
    pricePerKm: 3.5,
    rating: 4.8
  },
  {
    id: '2',
    name: '德邦物流',
    contactPerson: '王总监',
    phone: '400-222-2222',
    email: 'wang.director@deppon.com',
    serviceAreas: ['北京', '天津', '河北', '山东'],
    pricePerKm: 3.2,
    rating: 4.6
  },
  {
    id: '3',
    name: '中通快运',
    contactPerson: '张主管',
    phone: '400-333-3333',
    email: 'zhang.supervisor@zto.com',
    serviceAreas: ['上海', '江苏', '浙江', '安徽'],
    pricePerKm: 3.0,
    rating: 4.4
  }
];

// 基于订单数据的派送任务（一单制）
const mockDeliveryTasks: DeliveryTask[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    orderId: '1',
    customer: '张三',
    customerPhone: '13800138000',
    deliveryAddress: '广东省深圳市南山区科技园南区深南大道9988号',
    deliveryContact: '张三',
    deliveryPhone: '13800138000',
    truckingCompany: '顺丰速运',
    estimatedDeliveryDate: '2024-03-05',
    estimatedTimeSlot: '09:00-12:00',
    status: 'assigned',
    specialRequirements: '需要提前电话预约，工作日9-18点配送',
    assignedAt: '2024-03-01 10:30:00',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    orderId: '2',
    customer: '李四',
    customerPhone: '13900139000',
    deliveryAddress: '上海市浦东新区陆家嘴金融贸易区世纪大道100号',
    deliveryContact: '李四',
    deliveryPhone: '13900139000',
    truckingCompany: '中通快运',
    estimatedDeliveryDate: '2024-03-06',
    estimatedTimeSlot: '15:00-18:00',
    status: 'in_transit',
    specialRequirements: '货物较重，需要叉车卸货',
    assignedAt: '2024-03-02 14:20:00',
    createdAt: '2024-03-02',
    updatedAt: '2024-03-02'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    orderId: '3',
    customer: '王五',
    customerPhone: '13700137000',
    deliveryAddress: '北京市朝阳区建国门外大街1号国贸大厦',
    deliveryContact: '王五',
    deliveryPhone: '13700137000',
    status: 'pending',
    specialRequirements: '精密设备，需要防震包装',
    createdAt: '2024-03-03',
    updatedAt: '2024-03-03'
  }
];

export default function DeliveryPage() {
  const router = useRouter();
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>(mockDeliveryTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTask, setSelectedTask] = useState<DeliveryTask | null>(null);
  const [sortBy, setSortBy] = useState<keyof DeliveryTask>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 表单状态
  const [formData, setFormData] = useState({
    orderId: '',
    orderNumber: '',
    customer: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryContact: '',
    deliveryPhone: '',
    truckingCompany: '',
    estimatedDeliveryDate: '',
    estimatedTimeSlot: '',
    specialRequirements: ''
  });

  // 过滤和排序
  const filteredTasks = deliveryTasks
    .filter(task => {
      const matchesSearch = task.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                           task.customer.toLowerCase().includes(search.toLowerCase()) ||
                           task.deliveryAddress.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesCompany = companyFilter === 'all' || (task.truckingCompany && task.truckingCompany === companyFilter);
      return matchesSearch && matchesStatus && matchesCompany;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === 'asc') {
        // 处理可能为undefined的值
        const valueA = aValue ?? '';
        const valueB = bValue ?? '';
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        // 处理可能为undefined的值
        const valueA = aValue ?? '';
        const valueB = bValue ?? '';
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

  const paginatedTasks = filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (property: keyof DeliveryTask) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTasks(paginatedTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleCreateTask = () => {
    setDialogMode('create');
    setSelectedTask(null);
    setFormData({
      orderId: '',
      orderNumber: '',
      customer: '',
      customerPhone: '',
      deliveryAddress: '',
      deliveryContact: '',
      deliveryPhone: '',
      truckingCompany: '',
      estimatedDeliveryDate: '',
      estimatedTimeSlot: '',
      specialRequirements: ''
    });
    setDialogOpen(true);
  };

  const handleViewTask = (task: DeliveryTask) => {
    setSelectedTask(task);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditTask = (task: DeliveryTask) => {
    setSelectedTask(task);
    setDialogMode('edit');
    setFormData({
      orderId: task.orderId,
      orderNumber: task.orderNumber,
      customer: task.customer,
      customerPhone: task.customerPhone,
      deliveryAddress: task.deliveryAddress,
      truckingCompany: task.truckingCompany || '',
      estimatedDeliveryDate: task.estimatedDeliveryDate || '',
      estimatedTimeSlot: task.estimatedTimeSlot,
      specialRequirements: task.specialRequirements || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('确定要删除这个派送任务吗？')) {
      setDeliveryTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleSaveTask = () => {
    if (dialogMode === 'create') {
      const newTask: DeliveryTask = {
        id: Date.now().toString(),
        taskNumber: `DEL-2024-${String(deliveryTasks.length + 1).padStart(3, '0')}`,
        orderId: formData.orderId,
        orderNumber: formData.orderNumber,
        customer: formData.customer,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        truckingCompany: formData.truckingCompany,
        estimatedDeliveryDate: formData.estimatedDeliveryDate,
        estimatedTimeSlot: formData.estimatedTimeSlot,
        status: 'pending',
        specialRequirements: formData.specialRequirements,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setDeliveryTasks(prev => [...prev, newTask]);
    } else if (dialogMode === 'edit' && selectedTask) {
      setDeliveryTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? {
              ...task,
              orderId: formData.orderId,
              orderNumber: formData.orderNumber,
              customer: formData.customer,
              customerPhone: formData.customerPhone,
              deliveryAddress: formData.deliveryAddress,
              truckingCompany: formData.truckingCompany,
              estimatedDeliveryDate: formData.estimatedDeliveryDate,
              estimatedTimeSlot: formData.estimatedTimeSlot,
              specialRequirements: formData.specialRequirements,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : task
      ));
    }
    setDialogOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: DeliveryTask['status']) => {
    setDeliveryTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : task
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        派送管理
      </Typography>

      {/* 搜索和筛选区域 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="搜索任务编号、客户或订单号"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
              <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>状态筛选</InputLabel>
                <Select
                  value={statusFilter}
                  label="状态筛选"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="pending">待分配</MenuItem>
                  <MenuItem value="assigned">已分配</MenuItem>
                  <MenuItem value="in_transit">配送中</MenuItem>
                  <MenuItem value="delivered">已送达</MenuItem>
                  <MenuItem value="cancelled">已取消</MenuItem>
                </Select>
              </FormControl>
            </Grid>
              <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>物流公司</InputLabel>
                <Select
                  value={companyFilter}
                  label="物流公司"
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <MenuItem value="all">全部公司</MenuItem>
                  {mockTruckingCompanies.map(company => (
                    <MenuItem key={company.id} value={company.name}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
              <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTask}
                sx={{ mr: 1 }}
              >
                创建派送任务
              </Button>
            </Grid>
            </Grid>
        </CardContent>
      </Card>

      {/* 派送任务表格 */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedTasks.length > 0 && selectedTasks.length < paginatedTasks.length}
                    checked={paginatedTasks.length > 0 && selectedTasks.length === paginatedTasks.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'orderNumber'}
                    direction={sortBy === 'orderNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('orderNumber')}
                  >
                    订单号
                  </TableSortLabel>
                </TableCell>
                <TableCell>客户信息</TableCell>
                <TableCell>配送地址</TableCell>
                <TableCell>物流公司</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'estimatedDeliveryDate'}
                    direction={sortBy === 'estimatedDeliveryDate' ? sortOrder : 'asc'}
                    onClick={() => handleSort('estimatedDeliveryDate')}
                  >
                    预计配送日期
                  </TableSortLabel>
                </TableCell>
                <TableCell>时间段</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    状态
                  </TableSortLabel>
                </TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleSelectTask(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {task.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {task.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.customerPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.deliveryAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {task.truckingCompany ? (
                      <Typography variant="body2">{task.truckingCompany}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">未分配</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.estimatedDeliveryDate ? (
                      <Typography variant="body2">{task.estimatedDeliveryDate}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">待安排</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.estimatedTimeSlot ? (
                      <Typography variant="body2">{task.estimatedTimeSlot}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">待安排</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[task.status]}
                      color={statusColors[task.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="查看详情">
                      <IconButton size="small" onClick={() => handleViewTask(task)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton size="small" onClick={() => handleEditTask(task)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* 派送任务对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && '创建派送任务'}
          {dialogMode === 'edit' && '编辑派送任务'}
          {dialogMode === 'view' && '派送任务详情'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="关联订单ID"
                value={dialogMode === 'view' ? selectedTask?.orderId || '' : formData.orderId}
                onChange={(e) => setFormData(prev => ({ ...prev, orderId: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </Grid>
              <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="订单号"
                value={dialogMode === 'view' ? selectedTask?.orderNumber || '' : formData.orderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="客户姓名"
                value={dialogMode === 'view' ? selectedTask?.customer || '' : formData.customer}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="客户电话"
                value={dialogMode === 'view' ? selectedTask?.customerPhone || '' : formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                disabled={dialogMode === 'view'}
              />
            </Grid>
             <Grid item xs={12}>
              <TextField
                fullWidth
                label="配送地址"
                value={dialogMode === 'view' ? selectedTask?.deliveryAddress || '' : formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                disabled={dialogMode === 'view'}
                multiline
                rows={2}
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={dialogMode === 'view'}>
                <InputLabel>物流公司</InputLabel>
                <Select
                  value={dialogMode === 'view' ? selectedTask?.truckingCompany || '' : formData.truckingCompany}
                  label="物流公司"
                  onChange={(e) => setFormData(prev => ({ ...prev, truckingCompany: e.target.value }))}
                >
                  {mockTruckingCompanies.map(company => (
                    <MenuItem key={company.id} value={company.name}>
                      <Box>
                        <Typography variant="body2">{company.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {company.contactPerson} - {company.phone} - ¥{company.pricePerKm}/km
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="预计配送日期"
                type="date"
                value={dialogMode === 'view' ? selectedTask?.estimatedDeliveryDate || '' : formData.estimatedDeliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDeliveryDate: e.target.value }))}
                disabled={dialogMode === 'view'}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
             <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={dialogMode === 'view'}>
                <InputLabel>预计时间段</InputLabel>
                <Select
                  value={dialogMode === 'view' ? selectedTask?.estimatedTimeSlot || '' : formData.estimatedTimeSlot}
                  label="预计时间段"
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTimeSlot: e.target.value }))}
                >
                  {timeSlots.map(slot => (
                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="特殊要求"
                value={dialogMode === 'view' ? selectedTask?.specialRequirements || '' : formData.specialRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                disabled={dialogMode === 'view'}
                multiline
                rows={3}
                placeholder="如：需要提前电话联系、指定楼层、特殊搬运要求等"
              />
            </Grid>
            {dialogMode === 'view' && selectedTask && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="任务编号"
                    value={selectedTask.orderNumber}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="当前状态"
                    value={statusLabels[selectedTask.status]}
                    disabled
                  />
                </Grid>
                 <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="创建时间"
                    value={selectedTask.createdAt}
                    disabled
                  />
                </Grid>
                 <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="更新时间"
                    value={selectedTask.updatedAt}
                    disabled
                  />
                </Grid>

               </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSaveTask} variant="contained">
              保存
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}