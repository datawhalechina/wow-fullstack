import * as echarts from 'echarts'

// 深色主题配置
export const darkTheme: echarts.EChartsTheme = {
  color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#f1f5f9'
  },
  title: {
    textStyle: {
      color: '#f1f5f9',
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#94a3b8'
    }
  },
  legend: {
    textStyle: {
      color: '#94a3b8'
    }
  },
  tooltip: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    textStyle: {
      color: '#f1f5f9'
    },
    padding: [12, 16],
    borderWidth: 1,
    borderRadius: 8,
    extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#334155'
      }
    },
    axisLabel: {
      color: '#94a3b8',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#1e293b',
        type: 'dashed'
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#334155'
      }
    },
    axisLabel: {
      color: '#94a3b8',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#1e293b',
        type: 'dashed'
      }
    }
  },
  dataZoom: {
    textStyle: {
      color: '#94a3b8'
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#94a3b8'
    }
  },
  axisPointer: {
    lineStyle: {
      color: '#334155'
    },
    crossStyle: {
      color: '#334155'
    }
  },
  timeline: {
    lineStyle: {
      color: '#334155'
    },
    axisLine: {
      lineStyle: {
        color: '#334155'
      }
    },
    axisLabel: {
      color: '#94a3b8'
    },
    controlStyle: {
      color: '#6366f1',
      borderColor: '#6366f1'
    }
  },
  calendar: {
    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayLabel: {
      color: '#94a3b8'
    },
    monthLabel: {
      color: '#94a3b8'
    },
    yearLabel: {
      color: '#94a3b8'
    }
  },
  graphic: {
    textStyle: {
      color: '#94a3b8'
    }
  }
}

// 浅色主题配置
export const lightTheme: echarts.EChartsTheme = {
  color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#1e293b'
  },
  title: {
    textStyle: {
      color: '#1e293b',
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#64748b'
    }
  },
  legend: {
    textStyle: {
      color: '#64748b'
    }
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    textStyle: {
      color: '#1e293b'
    },
    padding: [12, 16],
    borderWidth: 1,
    borderRadius: 8,
    extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#e2e8f0'
      }
    },
    axisLabel: {
      color: '#64748b',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#f1f5f9',
        type: 'dashed'
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#e2e8f0'
      }
    },
    axisLabel: {
      color: '#64748b',
      fontSize: 12
    },
    splitLine: {
      lineStyle: {
        color: '#f1f5f9',
        type: 'dashed'
      }
    }
  }
}

// 注册主题
export const registerThemes = () => {
  echarts.registerTheme('dark', darkTheme)
  echarts.registerTheme('light', lightTheme)
}

// 默认主题色
export const chartColors = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6'  // teal
]

// 渐变色生成器
export const createGradient = (color: string, opacity: number = 0.3): string => {
  return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
}
