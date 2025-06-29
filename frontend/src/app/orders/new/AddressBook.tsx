import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  TextField,
  Alert,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

export interface AddressInfo {
  id: string;
  name: string;           // 地址簿名称
  company: string;        // 收件公司名称
  contact: string;        // 收件联系人
  phone: string;          // 收件联系电话
  address: string;        // 收件地址
  isDefault: boolean;     // 是否为默认地址
  createdAt: string;      // 创建时间
}

interface AddressBookProps {
  open: boolean;
  onClose: () => void;
  onSelectAddress: (address: AddressInfo) => void;
  onSaveAddress?: (address: Omit<AddressInfo, 'id' | 'createdAt'>) => void;
}

// 模拟地址簿数据
const mockAddresses: AddressInfo[] = [
  {
    id: '1',
    name: '公司总部',
    company: '深圳市科技有限公司',
    contact: '张经理',
    phone: '13800138001',
    address: '广东省深圳市南山区科技园南区高新南一道飞亚达大厦20楼',
    isDefault: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: '仓库地址',
    company: '深圳物流仓储中心',
    contact: '李主管',
    phone: '13800138002',
    address: '广东省深圳市宝安区西乡街道固戍社区航空路泰华梧桐岛工业园B栋',
    isDefault: false,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: '分公司',
    company: '上海分公司',
    contact: '王总监',
    phone: '13800138003',
    address: '上海市浦东新区陆家嘴金融贸易区世纪大道100号环球金融中心30楼',
    isDefault: false,
    createdAt: '2024-02-01'
  }
];

export default function AddressBook({ open, onClose, onSelectAddress, onSaveAddress }: AddressBookProps) {
  const [addresses, setAddresses] = useState<AddressInfo[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressInfo | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    company: '',
    contact: '',
    phone: '',
    address: '',
    isDefault: false
  });

  const handleSelectAddress = (address: AddressInfo) => {
    onSelectAddress(address);
    onClose();
  };

  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.contact || !newAddress.phone || !newAddress.address) {
      return;
    }

    const addressToSave: AddressInfo = {
      id: Date.now().toString(),
      ...newAddress,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAddresses(prev => [...prev, addressToSave]);
    
    if (onSaveAddress) {
      onSaveAddress(newAddress);
    }

    // 重置表单
    setNewAddress({
      name: '',
      company: '',
      contact: '',
      phone: '',
      address: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleEditAddress = (address: AddressInfo) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      company: address.company,
      contact: address.contact,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault
    });
    setShowAddForm(true);
  };

  const handleUpdateAddress = () => {
    if (!editingAddress || !newAddress.name || !newAddress.contact || !newAddress.phone || !newAddress.address) {
      return;
    }

    setAddresses(prev => prev.map(addr => 
      addr.id === editingAddress.id 
        ? { ...addr, ...newAddress }
        : addr
    ));

    setEditingAddress(null);
    setNewAddress({
      name: '',
      company: '',
      contact: '',
      phone: '',
      address: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setNewAddress({
      name: '',
      company: '',
      contact: '',
      phone: '',
      address: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">地址簿管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
            }
          }}
        >
          新增地址
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {showAddForm ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {editingAddress ? '编辑地址' : '新增地址'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="地址簿名称"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="如：公司总部、仓库地址等"
                  required
                />
              </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="收件公司名称"
                  value={newAddress.company}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="请输入收件公司名称"
                />
              </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="收件联系人"
                  value={newAddress.contact}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, contact: e.target.value }))}
                  placeholder="请输入收件联系人姓名"
                  required
                />
              </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="收件联系电话"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="请输入收件联系电话"
                  required
                />
              </Grid>
               <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="收件地址"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  multiline
                  rows={3}
                  placeholder="请输入详细的收件地址"
                  required
                />
              </Grid>
             </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={editingAddress ? handleUpdateAddress : handleSaveNewAddress}
                disabled={!newAddress.name || !newAddress.contact || !newAddress.phone || !newAddress.address}
              >
                {editingAddress ? '更新地址' : '保存地址'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
              >
                取消
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
          </Box>
        ) : null}
        
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          选择地址 ({addresses.length}个)
        </Typography>
        
        {addresses.length === 0 ? (
          <Alert severity="info">
            暂无保存的地址，请先添加地址到地址簿。
          </Alert>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {addresses.map((address) => (
              <Card 
                key={address.id} 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  }
                }}
                onClick={() => handleSelectAddress(address)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {address.name}
                      </Typography>
                      {address.isDefault && (
                        <Chip 
                          label="默认" 
                          size="small" 
                          color="primary" 
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        sx={{ color: '#f59e0b' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={1}>
                    {address.company && (
                      <Grid item size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {address.company}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {address.contact}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {address.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#64748b', mt: 0.2 }} />
                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.4 }}>
                          {address.address}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}