'use client';

import Link from 'next/link';
import { Box, Typography, Card, CardContent, Grid, Container } from '@mui/material';
import {
  Assignment as OrderIcon,
  LocalShipping as DeliveryIcon,
  Inventory as InventoryIcon,
  TrackChanges as TrackingIcon
} from '@mui/icons-material';

const modules = [
  {
    title: '订单管理',
    description: '管理采购订单，跟踪订单状态，处理清关信息',
    href: '/orders',
    icon: <OrderIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    color: '#1976d2'
  },
  {
    title: '派送管理',
    description: '安排第三方物流配送，管理派送任务和时间安排',
    href: '/delivery',
    icon: <DeliveryIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    color: '#2e7d32'
  },
  {
    title: '库存管理',
    description: '管理仓库库存，跟踪货物入库出库状态',
    href: '/inventory',
    icon: <InventoryIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    color: '#ed6c02'
  },
  {
    title: '物流跟踪',
    description: '实时跟踪货物运输状态和物流信息',
    href: '/tracking',
    icon: <TrackingIcon sx={{ fontSize: 48, color: 'info.main' }} />,
    color: '#0288d1'
  }
];

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          头程物流管理系统
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          现代化的物流管理解决方案，覆盖订单管理、派送安排、库存跟踪等核心业务流程
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {modules.map((module) => (
          <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={module.title}>
            <Link href={module.href} style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    '& .module-icon': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box 
                    className="module-icon"
                    sx={{ 
                      mb: 2,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {module.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          选择上方模块开始使用系统功能
        </Typography>
      </Box>
    </Container>
  );
}
