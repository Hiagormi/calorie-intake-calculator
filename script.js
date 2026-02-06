// ==================== 热量摄入计算器 ====================

// 获取DOM元素
const calcForm = document.getElementById('calcForm');
const resultSection = document.getElementById('resultSection');
const recalcBtn = document.getElementById('recalcBtn');

// 表单提交处理
calcForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取表单数据
    const formData = getFormData();

    // 验证表单数据
    if (!validateForm(formData)) {
        return;
    }

    // 计算结果
    const results = calculateResults(formData);

    // 显示结果
    displayResults(results, formData);

    // 平滑滚动到结果区域
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
});

// 重新计算按钮
recalcBtn.addEventListener('click', function() {
    resultSection.classList.add('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// 获取表单数据
function getFormData() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activity = parseFloat(document.querySelector('input[name="activity"]:checked').value);

    // 获取特殊情况
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked'))
        .map(cb => cb.value);

    return {
        gender,
        age,
        height,
        weight,
        activity,
        conditions
    };
}

// 验证表单数据
function validateForm(data) {
    // 验证年龄
    if (data.age < 18 || data.age > 85) {
        alert('年龄必须在18-85岁之间');
        return false;
    }

    // 验证身高
    if (data.height < 100 || data.height > 250) {
        alert('身高必须在100-250cm之间');
        return false;
    }

    // 验证体重
    if (data.weight < 30 || data.weight > 200) {
        alert('体重必须在30-200kg之间');
        return false;
    }

    return true;
}

// 计算结果
function calculateResults(data) {
    // 1. 计算标准体重
    const standardWeight = data.height - 105;

    // 2. 计算BMI
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);

    // 3. 判断是否肥胖（BMI >= 28）
    const isObese = bmi >= 28;
    const hasObesityCondition = data.conditions.includes('obesity');

    // 4. 确定热量系数（考虑肥胖情况）
    let calorieCoefficient = data.activity;

    // 如果是轻体力活动且肥胖/超重，减少5kcal
    if (data.activity === 30 && (isObese || hasObesityCondition)) {
        calorieCoefficient = 25;
    }
    // 其他活动水平，肥胖时也要适当减少
    else if ((isObese || hasObesityCondition) && data.activity > 30) {
        calorieCoefficient = data.activity - 5;
    }

    // 5. 计算总热量
    let totalCalories = standardWeight * calorieCoefficient;

    // 年龄调整（>60岁减少10-15%）
    if (data.age > 60) {
        totalCalories = totalCalories * 0.9; // 减少10%
    }

    // 6. 确定三大营养素比例
    let carbsPercent = 55;  // 默认55%
    let proteinPercent = 15; // 默认15%
    let fatPercent = 30;     // 默认30%

    // 糖尿病调整
    if (data.conditions.includes('diabetes')) {
        carbsPercent = 45;
        fatPercent = 40;
        proteinPercent = 15;
    }
    // 脑病调整
    else if (data.conditions.includes('brain')) {
        fatPercent = 40;
        carbsPercent = 45;
        proteinPercent = 15;
    }
    // 控碳/减脂调整
    else if (data.conditions.includes('lowcarb')) {
        carbsPercent = 50;
        fatPercent = 35;
        proteinPercent = 15;
    }

    // 7. 计算三大营养素克数
    const carbsGram = (totalCalories * carbsPercent / 100) / 4;
    const proteinGram = (totalCalories * proteinPercent / 100) / 4;
    const fatGram = (totalCalories * fatPercent / 100) / 9;

    // 8. 计算食物参考量
    const foodReference = calculateFoodReference(proteinGram, fatGram, carbsGram);

    return {
        standardWeight,
        bmi,
        totalCalories: Math.round(totalCalories),
        carbsGram: Math.round(carbsGram),
        proteinGram: Math.round(proteinGram),
        fatGram: Math.round(fatGram),
        carbsPercent,
        proteinPercent,
        fatPercent,
        foodReference,
        isObese
    };
}

// 计算食物参考量
function calculateFoodReference(proteinGram, fatGram, carbsGram) {
    // 根据蛋白质计算动物性食物
    // 假设动物蛋白占一半（50%）
    const animalProtein = proteinGram * 0.5;

    // 1个鸡蛋约6g蛋白质，200ml牛奶约6g蛋白质，肉类约17-20%蛋白质
    // 推荐：1个鸡蛋(6g) + 300ml牛奶(9g) + 其余来自肉类
    const eggProtein = 6;
    const milkProtein = 9;
    const remainingProtein = animalProtein - eggProtein - milkProtein;
    const meatGram = Math.round(remainingProtein / 0.175); // 17.5%平均

    // 脂肪参考：植物油占一半（约35g）
    const oilGram = Math.round(fatGram * 0.5);

    // 主食总量：碳水化合物克数
    // 假设主食含75%碳水化合物
    const grainGram = Math.round(carbsGram / 0.75);

    return {
        egg: 1, // 固定1个
        milk: Math.round(300 + (meatGram > 0 ? 0 : 100)), // 如果肉类少，增加牛奶
        meat: Math.max(0, meatGram),
        oil: oilGram,
        grain: grainGram
    };
}

// 显示结果
function displayResults(results, formData) {
    // 显示总热量
    document.getElementById('totalCalories').textContent = results.totalCalories;
    document.getElementById('standardWeight').textContent = results.standardWeight.toFixed(1);

    // 显示BMI
    document.getElementById('currentBMI').textContent = results.bmi.toFixed(1);

    // BMI状态
    const bmiStatus = document.getElementById('bmiStatus');
    bmiStatus.textContent = getBMIStatus(results.bmi);
    bmiStatus.className = 'bmi-status ' + getBMIStatusClass(results.bmi);

    // 显示三大营养素
    document.getElementById('carbsGram').textContent = results.carbsGram;
    document.getElementById('carbsPercent').textContent = results.carbsPercent + '%';
    document.getElementById('proteinGram').textContent = results.proteinGram;
    document.getElementById('proteinPercent').textContent = results.proteinPercent + '%';
    document.getElementById('fatGram').textContent = results.fatGram;
    document.getElementById('fatPercent').textContent = results.fatPercent + '%';

    // 更新碳水提示
    updateCarbsTip(results, formData);

    // 显示食物参考量
    document.getElementById('eggAmount').textContent = results.foodReference.egg + '个';
    document.getElementById('milkAmount').textContent = results.foodReference.milk + 'ml';
    document.getElementById('meatAmount').textContent = results.foodReference.meat + 'g';
    document.getElementById('oilAmount').textContent = results.foodReference.oil + 'g';
    document.getElementById('grainAmount').textContent = results.foodReference.grain + 'g';

    // 更新温馨提示
    updateTips(results, formData);

    // 显示结果区域
    resultSection.classList.remove('hidden');
}

// 获取BMI状态文本
function getBMIStatus(bmi) {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
}

// 获取BMI状态类名
function getBMIStatusClass(bmi) {
    if (bmi < 18.5) return 'normal';
    if (bmi < 24) return 'normal';
    if (bmi < 28) return 'overweight';
    return 'obese';
}

// 更新碳水提示
function updateCarbsTip(results, formData) {
    const carbsTip = document.getElementById('carbsTip');

    if (formData.conditions.includes('diabetes')) {
        carbsTip.textContent = '建议：控糖模式，碳水比例较低';
    } else if (formData.conditions.includes('lowcarb')) {
        carbsTip.textContent = '建议：粗粮占70%以上，配合运动效果更佳';
    } else if (results.isObese) {
        carbsTip.textContent = '建议：粗粮占70%，减少精制碳水';
    } else {
        carbsTip.textContent = '建议：粗粮占50-70%';
    }
}

// 更新温馨提示
function updateTips(results, formData) {
    const tipsList = document.getElementById('tipsList');
    const tips = [];

    // 年龄提示
    if (formData.age > 60) {
        tips.push('您已超过60岁，建议减少总热量10%-15%（已为您自动调整）');
    }

    // 肥胖提示
    if (results.isObese) {
        tips.push('您的BMI显示为肥胖，热量摄入已适当减少，建议配合运动减重');
    }

    // 糖尿病提示
    if (formData.conditions.includes('diabetes')) {
        tips.push('糖尿病模式：碳水化合物比例已调整为45%，请定期监测血糖');
    }

    // 脑病提示
    if (formData.conditions.includes('brain')) {
        tips.push('脑病模式：脂肪比例已提高，建议摄入优质脂肪（鱼类、坚果等）');
    }

    // 控碳提示
    if (formData.conditions.includes('lowcarb')) {
        tips.push('控碳模式：建议选择低升糖指数的粗粮，避免精米白面');
    }

    // 通用提示
    tips.push('实际摄入应结合真实活动量、饱腹感、血糖/体重变化动态调整');
    tips.push('本计算仅供参考，特殊疾病请咨询营养师/医生');

    // 更新列表
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

// ==================== 本地存储功能 ====================

// 保存表单数据到本地存储
function saveFormData(formData) {
    localStorage.setItem('calorieCalcData', JSON.stringify(formData));
}

// 从本地存储加载表单数据
function loadFormData() {
    const savedData = localStorage.getItem('calorieCalcData');
    if (savedData) {
        const data = JSON.parse(savedData);

        // 恢复表单数据
        document.querySelector(`input[name="gender"][value="${data.gender}"]`).checked = true;
        document.getElementById('age').value = data.age;
        document.getElementById('height').value = data.height;
        document.getElementById('weight').value = data.weight;
        document.querySelector(`input[name="activity"][value="${data.activity}"]`).checked = true;

        // 恢复特殊情况
        data.conditions.forEach(condition => {
            const checkbox = document.querySelector(`input[name="condition"][value="${condition}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

// 页面加载时尝试恢复数据
document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
});

// 表单数据变化时保存
calcForm.addEventListener('change', function() {
    const formData = getFormData();
    // 验证通过才保存
    if (formData.age && formData.height && formData.weight) {
        saveFormData(formData);
    }
});

// ==================== 工具函数 ====================

// 格式化数字
function formatNumber(num, decimals = 1) {
    return num.toFixed(decimals);
}

// 四舍五入
function roundNumber(num) {
    return Math.round(num);
}

// 限制数字范围
function clampNumber(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

// ==================== 键盘快捷键 ====================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 提交表单
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calcForm.dispatchEvent(new Event('submit'));
    }

    // ESC 隐藏结果
    if (e.key === 'Escape' && !resultSection.classList.contains('hidden')) {
        resultSection.classList.add('hidden');
    }
});

console.log('每日热量摄入计算器已加载完成！');
console.log('快捷键：Ctrl/Cmd + Enter 提交计算 | ESC 隐藏结果');
