import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use('*', logger(console.log))

// Generate unique user ID
function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Authentication routes
app.post('/make-server-23e1100b/auth/login', async (c) => {
  try {
    const { password, sessionToken } = await c.req.json()
    
    if (!password || password.length !== 4) {
      return c.json({ error: '請輸入4位數密碼' }, 400)
    }

    // Check if password exists
    const existingUsers = await kv.getByPrefix('user:')
    const user = existingUsers.find(userData => userData.password === password)
    
    if (user) {
      const newSessionToken = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Check for existing active session (prevent multi-device login)
      if (user.activeSession && user.activeSession !== sessionToken) {
        const sessionAge = Date.now() - new Date(user.lastActive).getTime()
        // If last session is less than 5 minutes old, block new login
        if (sessionAge < 5 * 60 * 1000) {
          return c.json({ 
            error: '此帳號已在其他裝置登入，請稍後再試或聯繫管理員',
            code: 'MULTI_DEVICE_LOGIN'
          }, 409)
        }
      }
      
      // Update last active time and session
      await kv.set(`user:${user.id}`, {
        ...user,
        lastActive: new Date().toISOString(),
        activeSession: newSessionToken,
        loginHistory: [
          ...(user.loginHistory || []).slice(-9), // Keep last 10 entries
          {
            timestamp: new Date().toISOString(),
            sessionToken: newSessionToken,
            userAgent: c.req.header('User-Agent') || 'Unknown'
          }
        ]
      })
      
      return c.json({ 
        userId: user.id,
        isAdmin: password === '6032',
        profile: user.profile,
        sessionToken: newSessionToken
      })
    }

    // No auto-creation of users for non-admin passwords
    if (password !== '6032') {
      return c.json({ error: '密碼錯誤或帳號不存在，請聯繫管理員' }, 401)
    }
    
    // Admin login
    if (password === '6032') {
      let adminUser = existingUsers.find(u => u.password === '6032')
      const newSessionToken = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      if (!adminUser) {
        const adminId = generateUserId()
        adminUser = {
          id: adminId,
          password: '6032',
          profile: {
            id: adminId,
            name: '絕對神',
            avatar: '👑',
            position: 'GOD',
            interests: ['管理', '培訓'],
            skills: ['領導能力', '系統管理'],
            bio: '絕對神',
            department: '總部',
            startDate: new Date().toISOString().split('T')[0],
            progress: 100,
            completedCategories: 7,
            totalCategories: 7
          },
          progress: {
            completedCategories: 7,
            totalCategories: 7,
            percentage: 100,
            categories: {}
          },
          permissions: {
            canViewOthers: true,
            canEditProfile: true
          },
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          activeSession: newSessionToken,
          loginHistory: [{
            timestamp: new Date().toISOString(),
            sessionToken: newSessionToken,
            userAgent: c.req.header('User-Agent') || 'Unknown'
          }]
        }
        
        await kv.set(`user:${adminId}`, adminUser)
      } else {
        // Check for existing active session for admin too
        if (adminUser.activeSession && adminUser.activeSession !== sessionToken) {
          const sessionAge = Date.now() - new Date(adminUser.lastActive).getTime()
          if (sessionAge < 5 * 60 * 1000) {
            return c.json({ 
              error: '管理員帳號已在其他裝置登入',
              code: 'MULTI_DEVICE_LOGIN'
            }, 409)
          }
        }
        
        // Update last active and session
        await kv.set(`user:${adminUser.id}`, {
          ...adminUser,
          lastActive: new Date().toISOString(),
          activeSession: newSessionToken,
          loginHistory: [
            ...(adminUser.loginHistory || []).slice(-9),
            {
              timestamp: new Date().toISOString(),
              sessionToken: newSessionToken,
              userAgent: c.req.header('User-Agent') || 'Unknown'
            }
          ]
        })
      }
      
      return c.json({ 
        userId: adminUser.id,
        isAdmin: true,
        profile: adminUser.profile,
        sessionToken: newSessionToken
      })
    }

    return c.json({ error: '密碼錯誤' }, 401)
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: '登入失敗' }, 500)
  }
})

// Get user profile
app.get('/make-server-23e1100b/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const user = await kv.get(`user:${userId}`)
    
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    // Ensure progress object exists with default values
    const progress = user.progress || {
      completedCategories: 0,
      totalCategories: 7,
      percentage: 0,
      categories: {}
    }
    
    return c.json({ profile: user.profile, progress })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ error: '獲取用戶資料失敗' }, 500)
  }
})

// Update user profile (for character setup)
app.put('/make-server-23e1100b/users/:userId/profile', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { profile } = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profile
      },
      editCount: (user.editCount || 0) + 1,
      lastActive: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}`, updatedUser)
    
    return c.json({ success: true, profile: updatedUser.profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return c.json({ error: '更新檔案失敗' }, 500)
  }
})

// Get user edit history
app.get('/make-server-23e1100b/users/:userId/edit-history', async (c) => {
  try {
    const userId = c.req.param('userId')
    const user = await kv.get(`user:${userId}`)
    
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    return c.json({ 
      editCount: user.editCount || 0,
      maxEdits: user.maxEdits || 2
    })
  } catch (error) {
    console.error('Get edit history error:', error)
    return c.json({ error: '獲取編輯歷史失敗' }, 500)
  }
})

// Update user progress
app.put('/make-server-23e1100b/users/:userId/progress', async (c) => {
  try {
    const userId = c.req.param('userId')
    const requestData = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    let updatedUser = { ...user }
    
    // Handle profile updates
    if (requestData.profile) {
      updatedUser.profile = {
        ...user.profile,
        ...requestData.profile
      }
    }
    
    // Handle progress updates
    if (requestData.progress) {
      updatedUser.progress = {
        ...user.progress,
        ...requestData.progress,
        categories: { 
          ...(user.progress?.categories || {}), 
          ...(requestData.categories || {})
        }
      }
      
      // Update profile progress fields if progress data exists
      if (requestData.progress.percentage !== undefined) {
        updatedUser.profile.progress = requestData.progress.percentage
      }
      if (requestData.progress.completedCategories !== undefined) {
        updatedUser.profile.completedCategories = requestData.progress.completedCategories
      }
    }
    
    // Handle categories updates
    if (requestData.categories && !requestData.progress) {
      updatedUser.progress = {
        ...user.progress,
        categories: { 
          ...(user.progress?.categories || {}), 
          ...requestData.categories
        }
      }
    }
    
    updatedUser.lastActive = new Date().toISOString()
    
    await kv.set(`user:${userId}`, updatedUser)
    
    return c.json({ success: true, profile: updatedUser.profile, progress: updatedUser.progress })
  } catch (error) {
    console.error('Update progress error:', error)
    return c.json({ error: '更新進度失敗' }, 500)
  }
})

// Admin routes
app.get('/make-server-23e1100b/admin/users', async (c) => {
  try {
    const users = await kv.getByPrefix('user:')
    
    const userList = users.map(user => ({
      id: user.id,
      password: user.password, // Keep full password for admin view
      profile: user.profile,
      progress: user.progress || {
        completedCategories: 0,
        totalCategories: 7,
        percentage: 0,
        categories: {}
      },
      permissions: user.permissions || {
        canView: [],
        canEdit: [],
        canManage: []
      },
      lastActive: user.lastActive
    }))
    
    return c.json({ users: userList })
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ error: '獲取用戶列表失敗' }, 500)
  }
})



app.delete('/make-server-23e1100b/admin/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    // Don't allow deleting admin
    if (user.password === '6032') {
      return c.json({ error: '無法刪除管理員帳號' }, 403)
    }
    
    await kv.del(`user:${userId}`)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({ error: '刪除用戶失敗' }, 500)
  }
})

// Export data
app.get('/make-server-23e1100b/admin/export', async (c) => {
  try {
    const users = await kv.getByPrefix('user:')
    
    // Generate CSV data
    const csvHeader = 'ID,Name,Position,Department,Password,Progress,CompletedCategories,LastActive,CreatedAt\n'
    const csvRows = users.map(user => {
      return [
        user.id,
        user.profile.name,
        user.profile.position,
        user.profile.department,
        user.password === '6032' ? 'ADMIN' : `****${user.password.slice(-4)}`,
        `${user.progress.percentage}%`,
        `${user.progress.completedCategories}/${user.progress.totalCategories}`,
        user.lastActive,
        user.createdAt
      ].join(',')
    }).join('\n')
    
    const csvContent = csvHeader + csvRows
    
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="training_data.csv"'
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return c.json({ error: '資料匯出失敗' }, 500)
  }
})

// Get team members for people directory
app.get('/make-server-23e1100b/team/members', async (c) => {
  try {
    const requesterId = c.req.query('requesterId')
    const requester = await kv.get(`user:${requesterId}`)
    
    if (!requester) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    const users = await kv.getByPrefix('user:')
    const isAdmin = requester.password === '6032' || requester.profile?.position === 'GOD' || requester.profile?.position === '絕對神'
    
    // Permission hierarchy: GOD/絕對神 > 管理職 > 內、外場正職 > 內、外場兼職
    const getViewPermissions = (userPosition) => {
      switch (userPosition) {
        case 'GOD':
        case '絕對神':
          return ['GOD', '絕對神', '管理職', '外場', '內場', '外場PT', '內場PT']
        case '管理職':
          return ['管理職', '外場', '內場', '外場PT', '內場PT']
        case '外場':
        case '內場':
          return ['外場', '內場', '外場PT', '內場PT']
        case '外場PT':
        case '內場PT':
          return ['外場PT', '內場PT']
        default:
          return [userPosition]
      }
    }
    
    const allowedPositions = getViewPermissions(requester.profile?.position || '')
    
    let filteredMembers = users.filter(user => {
      // Include current user
      if (user.id === requesterId) return true
      
      // Check if the user's position is viewable
      if (!allowedPositions.includes(user.profile?.position || '')) return false
      
      // Hide admin users unless current user is admin (except in admin interface)
      if (!isAdmin && (user.profile?.position === 'GOD' || user.profile?.position === '絕對神')) {
        return false
      }
      
      return true
    })
    
    const members = filteredMembers.map(user => {
      const now = new Date();
      const lastActive = new Date(user.lastActive || new Date().toISOString());
      const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
      
      // Determine online status
      let onlineStatus = 'offline';
      if (user.activeSession && diffMinutes < 5) {
        onlineStatus = 'online';
      } else if (diffMinutes < 30) {
        onlineStatus = 'recent';
      } else if (diffMinutes < 60) {
        onlineStatus = 'away';
      }
      
      return {
        profile: {
          ...user.profile,
          progress: user.progress?.percentage || 0,
          completedCategories: user.progress?.completedCategories || 0,
          totalCategories: user.progress?.totalCategories || 7
        },
        lastActive: user.lastActive || new Date().toISOString(),
        onlineStatus,
        isOnline: user.activeSession && diffMinutes < 5
      };
    })
    
    return c.json({ members })
  } catch (error) {
    console.error('Get team members error:', error)
    return c.json({ error: '獲取團隊成員失敗' }, 500)
  }
})

// Permission management routes
app.put('/make-server-23e1100b/admin/users/:userId/permissions', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { permissions } = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    const updatedUser = {
      ...user,
      permissions: {
        ...user.permissions,
        ...permissions
      },
      lastActive: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}`, updatedUser)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update permissions error:', error)
    return c.json({ error: '更新權限失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/admin/users/:userId/position', async (c) => {
  try {
    const userId = c.req.param('userId')
    const updates = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...updates
      },
      lastActive: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}`, updatedUser)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update position error:', error)
    return c.json({ error: '更新職位失敗' }, 500)
  }
})

// Task management routes
app.get('/make-server-23e1100b/tasks', async (c) => {
  try {
    const tasks = await kv.getByPrefix('task:')
    return c.json({ tasks: tasks || [] })
  } catch (error) {
    console.error('Get tasks error:', error)
    return c.json({ error: '獲取任務失敗' }, 500)
  }
})

app.post('/make-server-23e1100b/tasks', async (c) => {
  try {
    const taskData = await c.req.json()
    
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newTask = {
      id: taskId,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`task:${taskId}`, newTask)
    
    return c.json({ success: true, taskId })
  } catch (error) {
    console.error('Create task error:', error)
    return c.json({ error: '建立任務失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/tasks/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const updates = await c.req.json()
    
    const task = await kv.get(`task:${taskId}`)
    if (!task) {
      return c.json({ error: '任務不存在' }, 404)
    }
    
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`task:${taskId}`, updatedTask)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update task error:', error)
    return c.json({ error: '更新任務失敗' }, 500)
  }
})

app.delete('/make-server-23e1100b/tasks/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId')
    
    const task = await kv.get(`task:${taskId}`)
    if (!task) {
      return c.json({ error: '任務不存在' }, 404)
    }
    
    await kv.del(`task:${taskId}`)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete task error:', error)
    return c.json({ error: '刪除任務失敗' }, 500)
  }
})

// Enhanced admin user creation with new fields (replaces previous route)
app.post('/make-server-23e1100b/admin/users', async (c) => {
  try {
    const userData = await c.req.json()
    const { password, name, position, virtualPosition, adminSetPosition, department, hireDate } = userData
    
    if (!password || password.length !== 4) {
      return c.json({ error: '密碼必須為4位數字' }, 400)
    }
    
    if (!name || !position) {
      return c.json({ error: '請填寫姓名和職位' }, 400)
    }
    
    // Check if password already exists
    const existingUsers = await kv.getByPrefix('user:')
    const existingUser = existingUsers.find(u => u.password === password)
    
    if (existingUser) {
      return c.json({ error: '此密碼已被使用' }, 400)
    }
    
    const userId = generateUserId()
    const newUser = {
      id: userId,
      password,
      profile: {
        id: userId,
        name,
        position,
        virtualPosition: virtualPosition || '',
        adminSetPosition: adminSetPosition || '',
        department: department || '',
        hireDate: hireDate || new Date().toISOString().split('T')[0],
        avatar: '👤',
        interests: [],
        skills: [],
        bio: '',
        startDate: new Date().toISOString().split('T')[0],
        progress: 0,
        completedCategories: 0,
        totalCategories: 7,
        isFirstLogin: true
      },
      progress: {
        completedCategories: 0,
        totalCategories: 7,
        percentage: 0,
        categories: {}
      },
      permissions: {
        canView: [],
        canEdit: [],
        canManage: []
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
    
    await kv.set(`user:${userId}`, newUser)
    
    return c.json({ success: true, userId })
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({ error: '創建用戶失敗' }, 500)
  }
})

// Content management routes
app.get('/make-server-23e1100b/admin/training-content', async (c) => {
  try {
    // Return mock training content structure
    const content = [
      {
        id: 'outdoor-1',
        path: 'outdoor',
        categoryId: '1',
        categoryTitle: '新人培訓',
        subTasks: [
          {
            id: '1-1',
            title: '基礎服務',
            description: '學習基本服務技巧與禮儀',
            sopLink: '/sop/basic-service.pdf',
            clockInfo: {
              location: '員工休息室',
              workTime: '09:00-18:00',
              breakTime: '12:00-13:00'
            },
            additionalInfo: ['服務禮儀標準', '客戶溝通技巧', '基本餐具知識']
          }
        ]
      },
      {
        id: 'indoor-1',
        path: 'indoor',
        categoryId: '1',
        categoryTitle: '廚房基礎',
        subTasks: [
          {
            id: '1-1',
            title: '食品安全',
            description: '學習食品安全與衛生標準',
            sopLink: '/sop/food-safety.pdf',
            clockInfo: {
              location: '廚房入口',
              workTime: '10:00-22:00',
              breakTime: '15:00-16:00'
            },
            additionalInfo: ['HACCP標準', '清潔消毒', '溫度控制']
          }
        ]
      }
    ]
    
    return c.json({ content })
  } catch (error) {
    console.error('Get training content error:', error)
    return c.json({ error: '載入培訓內容失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/admin/training-content/:contentId', async (c) => {
  try {
    const contentId = c.req.param('contentId')
    const { content } = await c.req.json()
    
    // Store content updates (in real app would update database)
    await kv.set(`training-content:${contentId}`, content)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update training content error:', error)
    return c.json({ error: '更新培訓內容失敗' }, 500)
  }
})

app.get('/make-server-23e1100b/admin/tasks', async (c) => {
  try {
    const tasks = await kv.getByPrefix('task:')
    return c.json({ tasks: tasks || [] })
  } catch (error) {
    console.error('Get tasks error:', error)
    return c.json({ error: '載入任務失敗' }, 500)
  }
})

app.post('/make-server-23e1100b/admin/tasks', async (c) => {
  try {
    const { task } = await c.req.json()
    
    const taskId = `task-${Date.now()}`
    const newTask = {
      ...task,
      id: taskId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`task:${taskId}`, newTask)
    
    return c.json({ success: true, task: newTask })
  } catch (error) {
    console.error('Create task error:', error)
    return c.json({ error: '創建任務失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/admin/tasks/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId')
    const { task } = await c.req.json()
    
    const existingTask = await kv.get(`task:${taskId}`)
    if (!existingTask) {
      return c.json({ error: '任務不存在' }, 404)
    }
    
    const updatedTask = {
      ...existingTask,
      ...task,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`task:${taskId}`, updatedTask)
    
    return c.json({ success: true, task: updatedTask })
  } catch (error) {
    console.error('Update task error:', error)
    return c.json({ error: '更新任務失敗' }, 500)
  }
})

// Guild Castle content management routes
app.get('/make-server-23e1100b/guild/content', async (c) => {
  try {
    const companyRules = await kv.get('guild:companyRules') || '1. 準時上班，不遲到早退\n2. 保持工作環境整潔\n3. 團隊合作，互相幫助\n4. 客戶至上，服務第一\n5. 持續學習，提升技能'
    const bonusSystem = await kv.get('guild:bonusSystem') || '• 月度績效獎金：根據個人表現發放\n• 年終獎金：依據公司營運狀況\n• 推薦獎金：成功推薦新員工\n• 技能提升獎勵：完成培訓課程'
    const benefits = await kv.get('guild:benefits') || '• 勞健保完整保障\n• 員工餐飲優惠\n• 生日禮金與假期\n• 教育訓練補助\n• 員工旅遊活動\n• 績優員工獎勵'
    
    return c.json({ 
      companyRules,
      bonusSystem,
      benefits
    })
  } catch (error) {
    console.error('Get guild content error:', error)
    return c.json({ error: '載入公會內容失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/guild/content', async (c) => {
  try {
    const { type, content } = await c.req.json()
    
    if (!['companyRules', 'bonusSystem', 'benefits'].includes(type)) {
      return c.json({ error: '無效的內容類型' }, 400)
    }
    
    await kv.set(`guild:${type}`, content)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update guild content error:', error)
    return c.json({ error: '更新公會內容失敗' }, 500)
  }
})

// New Guild Castle content management routes
app.get('/make-server-23e1100b/guild-castle/content', async (c) => {
  try {
    const contents = await kv.getByPrefix('castle-content:')
    
    // If no contents exist, create default ones
    if (contents.length === 0) {
      const defaultContents = [
        {
          id: 'company-rules-1',
          type: 'company_rules',
          title: '基本工作規範',
          content: '1. 準時上班，不遲到早退\n2. 保持工作環境整潔衛生\n3. 團隊合作，互相協助\n4. 客戶至上，提供優質服務\n5. 持續學習，提升專業技能\n6. 遵守食品安全規定\n7. 積極參與公司培訓活動',
          lastUpdated: new Date().toISOString(),
          updatedBy: '系統管理員',
          order: 1
        },
        {
          id: 'bonus-system-1',
          type: 'bonus_system',
          title: '績效獎金制度',
          content: '🏆 月度績效獎金\n• 基於個人工作表現\n• 客戶服務評價\n• 團隊合作精神\n\n💰 年終獎金\n• 依據公司年度營運狀況\n• 個人年度貢獻度\n• 出勤率及穩定性\n\n🎯 特殊獎勵\n• 推薦優秀人才獎金\n• 技能認證完成獎勵\n• 創新改善提案獎金',
          lastUpdated: new Date().toISOString(),
          updatedBy: '系統管理員',
          order: 1
        },
        {
          id: 'benefits-1',
          type: 'benefits',
          title: '員工福利制度',
          content: '🛡️ 基本保障\n• 勞保、健保完整保障\n• 勞退提撥\n• 團體保險\n\n🍽️ 生活福利\n• 員工餐飲優惠\n• 生日禮金與特休\n• 年節獎金\n\n📚 成長福利\n• 教育訓練補助\n• 證照考試費用補助\n• 內部升遷機會\n\n🎉 娛樂福利\n• 員工旅遊活動\n• 尾牙春酒聚餐\n• 績優員工表揚',
          lastUpdated: new Date().toISOString(),
          updatedBy: '系統管理員',
          order: 1
        }
      ]
      
      // Save default contents
      for (const content of defaultContents) {
        await kv.set(`castle-content:${content.id}`, content)
      }
      
      return c.json({ contents: defaultContents })
    }
    
    return c.json({ contents })
  } catch (error) {
    console.error('Get guild castle content error:', error)
    return c.json({ error: '載入城堡內容失敗' }, 500)
  }
})

app.post('/make-server-23e1100b/guild-castle/content', async (c) => {
  try {
    const contentData = await c.req.json()
    
    const contentId = `castle-content-${Date.now()}`
    const existingContents = await kv.getByPrefix('castle-content:')
    const sameTypeContents = existingContents.filter(content => content.type === contentData.type)
    
    const newContent = {
      id: contentId,
      ...contentData,
      order: sameTypeContents.length + 1,
      lastUpdated: new Date().toISOString()
    }
    
    await kv.set(`castle-content:${contentId}`, newContent)
    
    return c.json({ success: true, content: newContent })
  } catch (error) {
    console.error('Create guild castle content error:', error)
    return c.json({ error: '創建城堡內容失敗' }, 500)
  }
})

app.put('/make-server-23e1100b/guild-castle/content/:contentId', async (c) => {
  try {
    const contentId = c.req.param('contentId')
    const updates = await c.req.json()
    
    const existingContent = await kv.get(`castle-content:${contentId}`)
    if (!existingContent) {
      return c.json({ error: '內容不存在' }, 404)
    }
    
    const updatedContent = {
      ...existingContent,
      ...updates,
      id: contentId,
      lastUpdated: new Date().toISOString()
    }
    
    await kv.set(`castle-content:${contentId}`, updatedContent)
    
    return c.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error('Update guild castle content error:', error)
    return c.json({ error: '更新城堡內容失敗' }, 500)
  }
})

app.delete('/make-server-23e1100b/guild-castle/content/:contentId', async (c) => {
  try {
    const contentId = c.req.param('contentId')
    
    const existingContent = await kv.get(`castle-content:${contentId}`)
    if (!existingContent) {
      return c.json({ error: '內容不存在' }, 404)
    }
    
    await kv.del(`castle-content:${contentId}`)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete guild castle content error:', error)
    return c.json({ error: '刪除城堡內容失敗' }, 500)
  }
})

// Logout route
app.post('/make-server-23e1100b/auth/logout', async (c) => {
  try {
    const { userId, sessionToken } = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ error: '用戶不存在' }, 404)
    }
    
    // Clear active session if it matches
    if (user.activeSession === sessionToken) {
      await kv.set(`user:${userId}`, {
        ...user,
        activeSession: null,
        lastActive: new Date().toISOString()
      })
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: '登出失敗' }, 500)
  }
})

// Session validation route
app.post('/make-server-23e1100b/auth/validate-session', async (c) => {
  try {
    const { userId, sessionToken } = await c.req.json()
    
    const user = await kv.get(`user:${userId}`)
    if (!user) {
      return c.json({ valid: false, error: '用戶不存在' }, 404)
    }
    
    const isValid = user.activeSession === sessionToken
    
    if (isValid) {
      // Update last active time
      await kv.set(`user:${userId}`, {
        ...user,
        lastActive: new Date().toISOString()
      })
    }
    
    return c.json({ valid: isValid })
  } catch (error) {
    console.error('Session validation error:', error)
    return c.json({ valid: false, error: '驗證失敗' }, 500)
  }
})

// Debug routes for admin
app.get('/make-server-23e1100b/admin/debug/system-status', async (c) => {
  try {
    const users = await kv.getByPrefix('user:')
    const tasks = await kv.getByPrefix('task:')
    const guildContent = await kv.getByPrefix('guild:')
    
    const activeUsers = users.filter(user => {
      const lastActive = new Date(user.lastActive)
      const timeDiff = Date.now() - lastActive.getTime()
      return timeDiff < 30 * 60 * 1000 // Active in last 30 minutes
    })
    
    const onlineUsers = users.filter(user => user.activeSession && user.activeSession !== null)
    
    const systemStats = {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      onlineUsers: onlineUsers.length,
      totalTasks: tasks.length,
      guildContentItems: guildContent.length,
      serverUptime: Date.now(),
      memoryUsage: {
        users: users.length * 2, // Approximate KB per user
        tasks: tasks.length * 1,
        total: (users.length * 2) + (tasks.length * 1)
      }
    }
    
    return c.json({ systemStats, onlineUsers: onlineUsers.map(user => ({
      id: user.id,
      name: user.profile.name,
      lastActive: user.lastActive,
      sessionToken: user.activeSession?.slice(-8) || 'N/A'
    })) })
  } catch (error) {
    console.error('System status error:', error)
    return c.json({ error: '獲取系統狀態失敗' }, 500)
  }
})

app.get('/make-server-23e1100b/admin/debug/error-logs', async (c) => {
  try {
    // In a real system, you would fetch actual error logs
    // For now, return mock error data
    const errorLogs = await kv.get('system:errorLogs') || []
    
    return c.json({ errorLogs })
  } catch (error) {
    console.error('Error logs fetch error:', error)
    return c.json({ error: '獲取錯誤日誌失敗' }, 500)
  }
})

app.post('/make-server-23e1100b/admin/debug/log-error', async (c) => {
  try {
    const { error, context, timestamp } = await c.req.json()
    
    const errorLogs = await kv.get('system:errorLogs') || []
    const newErrorLogs = [
      ...errorLogs.slice(-99), // Keep last 100 errors
      {
        id: Date.now(),
        error,
        context,
        timestamp: timestamp || new Date().toISOString()
      }
    ]
    
    await kv.set('system:errorLogs', newErrorLogs)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Log error failed:', error)
    return c.json({ error: '記錄錯誤失敗' }, 500)
  }
})

Deno.serve(app.fetch)