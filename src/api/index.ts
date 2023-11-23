import {request,METHOD} from '../utils/request.js'

// 一级接口


// 新建飞行航线

export async function postAddPlanInfo(loginForm:any) { 
  return request('/api/planInfo/addPlanInfo', METHOD.POST,
    loginForm)
}

// 更新航线
export async function postEditPlanInfo(loginForm:any) { 
  return request('/api/planInfo/editPlanInfo', METHOD.POST,
    loginForm)
}

// 删除航线

export async function postDeletePlanInfo(loginForm:any) { 
  return request('/api/planInfo/deletePlanInfo', METHOD.GET,
    loginForm)
}

// 获取航线列表
export async function postSelectListPlanInfo(loginForm:any) { 
  return request('/api/planInfo/selectListPlanInfo', METHOD.GET,
    loginForm)
}
// 飞行计划列表
export async function getSelectListPlanExecute(loginForm:any) { 
  return request('/api/planExecute/selectListPlanExecute', METHOD.GET,loginForm
    )
}

// 新建 ?pageNum=10&pageSize=10
export async function postAddPlanExecute(loginForm:any) { 
  return request('/api/planExecute/addPlanExecute', METHOD.POST,
    loginForm)
}

export async function postEeditPlanExecute(loginForm:any) { 
  return request('/api/planExecute/editPlanExecute', METHOD.POST,
    loginForm)
}

export async function getEeditPlanExecute(loginForm:any) { 
  return request(`/api/planExecute/selectPlanInfo`, METHOD.GET,
    loginForm)
}

export async function postFlightInfoGround(loginForm:any) { 
  return request('/api/emuairPlane/flightInfoGround', METHOD.POST,
    loginForm)
}

export async function postFlightInfo(loginForm:any) { 
  return request('/api/emuairPlane/flightInfo', METHOD.POST,
    loginForm)
}

// 获取任务列表
export async function getSelectListTask(loginForm:any) { 
  return request('/api/taskInfo/selectListTaskInfo', METHOD.GET,
    loginForm)
}
// 创建任务

export async function postAddTaskInfo(loginForm:any) { 
  return request('/api/taskInfo/addTaskInfo', METHOD.POST,
    loginForm)
}

// 编辑任务
  
export async function postEditTaskInfo(loginForm:any) { 
  return request('/api/taskInfo/editTaskInfo', METHOD.POST,
    loginForm)
}


export async function postdynamicPlanExecute(loginForm:any) { 
  return request('/api/planExecute/dynamicPlanExecute', METHOD.POST,
    loginForm)
}

// 飞行计划列表 
export async function getHistoryPlanList(loginForm:any) { 
  return request('/api/fightPathHistory/historyPlanList', METHOD.GET,
    loginForm)
}
// 飞行执行详情 
export async function getSelectPlanExecuteByPlanId(loginForm:any) { 
  return request('/api/planExecute/selectPlanExecuteByPlanId', METHOD.GET,
    loginForm)
}
// 历史轨迹 
export async function getHistoryInfo(loginForm:any) { 
  return request('/api/fightPathHistory/historyInfo', METHOD.GET,
    loginForm)
}

// 新增任务下达

// 修改任务下达

// 获取飞行器姿态定位


