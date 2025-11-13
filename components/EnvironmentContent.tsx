import React from 'react';
import exampleImage from 'figma:asset/cac2a8694df6e812f8e1fbf45a8e2ab17fd507e8.png';

const EnvironmentContent = React.memo(() => {
  return (
    <div className="space-y-4">
      {/* Restaurant layout */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">餐廳環境佈局圖</h3>
        <div className="w-full overflow-hidden rounded-lg">
          <img 
            src={exampleImage} 
            alt="餐廳環境佈局圖" 
            className="w-full h-auto object-contain bg-white max-h-64"
            loading="lazy"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">熟悉餐廳各區域配置，有助於提升工作效率</p>
      </div>

      {/* Clock-in rules */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">⏰ 打卡規範</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">上班卡</h4>
            <p className="text-sm text-blue-700">
              最早可提前15分鐘內打卡。例如：12:00上班，可在11:45打卡。
              <span className="block font-medium text-red-600 mt-1">⚠️ 超過12:00算遲到要扣薪</span>
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">下班卡</h4>
            <p className="text-sm text-green-700">
              需準時打卡，不得超過15分鐘。
              <span className="block font-medium text-orange-600 mt-1">🔺 超過需在打卡後申請補卡</span>
            </p>
          </div>
        </div>
      </div>

      {/* Meeting schedule */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">🤝 班前會議</h3>
        <div className="bg-yellow-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-yellow-800 font-medium">
            每日11:50、17:50 內外場準時集合開班前會議
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">🔺 外場準備事項</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 穿好圍裙</li>
              <li>• 帶好名牌</li>
              <li>• 拿好耳麥和對講機</li>
            </ul>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">🔺 內場準備事項</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• 帶上帽子</li>
              <li>• 換好廚師鞋</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Training manuals */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">📚 操作手冊與SOP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a 
            href="https://reurl.cc/Y3926D" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <h4 className="font-medium text-blue-800 mb-1">外場實務操作手冊PPT</h4>
            <p className="text-xs text-blue-600">點擊查看 →</p>
          </a>
          <a 
            href="https://reurl.cc/1KyEYX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
          >
            <h4 className="font-medium text-purple-800 mb-1">吧台手冊PPT</h4>
            <p className="text-xs text-purple-600">點擊查看 →</p>
          </a>
          <a 
            href="https://reurl.cc/5RG6rn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
            <h4 className="font-medium text-green-800 mb-1">球員手冊PPT更新</h4>
            <p className="text-xs text-green-600">點擊查看 →</p>
          </a>
          <a 
            href="https://reurl.cc/MzWx4v" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-50 p-3 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            <h4 className="font-medium text-red-800 mb-1">內場出餐SOP</h4>
            <p className="text-xs text-red-600">點擊查看 →</p>
          </a>
        </div>
      </div>

      {/* Company Policies & Benefits */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">🏛️ 公司制度規範</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Rules */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-3">📋 工作規範</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>準時上下班，遵守打卡規定</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>保持工作區域整潔衛生</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>穿著規定制服及配戴名牌</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>禁止在工作時間使用私人手機</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>遵守食品安全衛生標準</span>
              </li>
            </ul>
          </div>

          {/* Leave Policy */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">🗓️ 請假制度</h4>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>事假需提前3天申請</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>病假需提供醫生證明</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>特休假依勞基法規定</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>臨時請假需電話通知</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>連假調班需提前協調</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bonus & Incentive System */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">💰 獎金制度</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance Bonus */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-3">🏆 績效獎金</h4>
            <div className="space-y-2">
              <div className="text-sm text-yellow-700">
                <div className="font-medium">月度績效獎金</div>
                <div>根據個人表現評核</div>
                <div className="text-xs text-yellow-600 mt-1">$500 - $3,000</div>
              </div>
              <div className="text-sm text-yellow-700">
                <div className="font-medium">季度團隊獎金</div>
                <div>達成店舖目標額外發放</div>
                <div className="text-xs text-yellow-600 mt-1">$1,000 - $5,000</div>
              </div>
            </div>
          </div>

          {/* Training Bonus */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-3">📚 學習獎勵</h4>
            <div className="space-y-2">
              <div className="text-sm text-orange-700">
                <div className="font-medium">訓練完成獎金</div>
                <div>完成SOP培訓課程</div>
                <div className="text-xs text-orange-600 mt-1">每階段 $300</div>
              </div>
              <div className="text-sm text-orange-700">
                <div className="font-medium">證照取得獎勵</div>
                <div>考取相關專業證照</div>
                <div className="text-xs text-orange-600 mt-1">$1,000 - $3,000</div>
              </div>
            </div>
          </div>

          {/* Referral Bonus */}
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
            <h4 className="font-medium text-pink-800 mb-3">👥 推薦獎金</h4>
            <div className="space-y-2">
              <div className="text-sm text-pink-700">
                <div className="font-medium">員工推薦獎勵</div>
                <div>成功推薦新進員工</div>
                <div className="text-xs text-pink-600 mt-1">滿3個月 $2,000</div>
              </div>
              <div className="text-sm text-pink-700">
                <div className="font-medium">長期合作獎金</div>
                <div>推薦員工滿一年</div>
                <div className="text-xs text-pink-600 mt-1">額外 $3,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Benefits */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">🎁 員工福利</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">🏥 基本福利</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                勞健保依法投保
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                員工團保加保
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                年終獎金發放
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                三節禮金/禮品
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                員工生日禮金
              </li>
            </ul>
          </div>

          {/* Additional Benefits */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-3">✨ 額外福利</h4>
            <ul className="text-sm text-purple-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                員工餐點補助
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                制服免費提供
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                定期員工聚餐
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                教育訓練補助
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                績優員工旅遊
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Career Development */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">🚀 職涯發展</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-800 mb-3">📈 晉升階梯</h4>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Career Path */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                <div className="text-sm font-medium text-gray-700">兼職人員</div>
                <div className="text-xs text-gray-500">PT</div>
              </div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">→</div>
              <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                <div className="text-sm font-medium text-gray-700">正職員工</div>
                <div className="text-xs text-gray-500">Full-time</div>
              </div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">→</div>
              <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                <div className="text-sm font-medium text-gray-700">組長/領班</div>
                <div className="text-xs text-gray-500">Supervisor</div>
              </div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">→</div>
              <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                <div className="text-sm font-medium text-gray-700">店長/主管</div>
                <div className="text-xs text-gray-500">Manager</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-indigo-700">
            <p>💡 <strong>晉升標準：</strong>工作表現、學習能力、團隊合作、領導潛力</p>
            <p>📋 <strong>評核方式：</strong>季度考核 + 360度回饋 + 主管推薦</p>
          </div>
        </div>
      </div>
    </div>
  );
});

EnvironmentContent.displayName = 'EnvironmentContent';

export { EnvironmentContent };