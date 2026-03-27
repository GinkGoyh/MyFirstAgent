// 中国节假日数据（2026年）
const holidays = [
    { name: "元旦", date: "2026-01-01" },
    { name: "春节", date: "2026-01-29" },
    { name: "清明节", date: "2026-04-05" },
    { name: "劳动节", date: "2026-05-01" },
    { name: "端午节", date: "2026-06-19" },
    { name: "中秋节", date: "2026-09-25" },
    { name: "国庆节", date: "2026-10-01" }
];

const quoteEl = document.getElementById("quote");
const today = new Date();

let nextHoliday = null;
for (let i = 0; i < holidays.length; i++) {
    if (new Date(holidays[i].date) >= today) {
        nextHoliday = holidays[i];
        break;
    }
}

if (nextHoliday !== null) {
    const days = Math.ceil((new Date(nextHoliday.date) - today) / (1000 * 60 * 60 * 24));
    quoteEl.textContent = "下一个假期：" + nextHoliday.name + "（" + nextHoliday.date + "）还有 " + days + " 天";
} else {
    quoteEl.textContent = "今年的假期都过完啦！";
}

// ==========================================
// 待办清单功能
// 用数组存储数据，用循环渲染页面
// ==========================================

// 用数组存储所有待办事项
// 每个待办是一个"对象"，包含文字内容和是否完成
// 从浏览器本地存储读取待办数据，如果没有就用默认数据
const saved = localStorage.getItem("todos");

let todos;
if (saved !== null) {
    todos = JSON.parse(saved);
} else {
    todos = [
        { text: "学习 HTML 基础", done: true },
        { text: "学习 CSS 样式", done: true },
        { text: "学习 JavaScript 基础", done: true },
        { text: "学习数组和循环", done: false },
        { text: "学习读代码和 Review", done: false }
    ];
}

// 找到页面上的元素
const todoInput = document.getElementById("todoInput");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const todoList = document.getElementById("todoList");
const stats = document.getElementById("stats");

// 当前搜索关键词，空字符串表示不过滤
let searchKeyword = "";


// ------------------------------------------
// 渲染函数：把数组里的数据显示到页面上
// 每次数据变化后都要调用这个函数来刷新页面
// ------------------------------------------
const renderTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));    // 把最新的待办数据保存到浏览器本地存储
    // 先清空列表，防止重复显示
    todoList.innerHTML = "";

    // 如果数组为空，显示提示
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-tip">暂无待办事项，添加一个吧！</li>';
        stats.textContent = "";
        return;    // return 表示"到此结束，下面的代码不执行了"
    }

    // 根据搜索关键词过滤，只显示包含关键词的项（不修改原数组）
    // toLowerCase() 把字符串转成小写，两边都转后比较，就能忽略大小写
    const visibleTodos = todos.filter((item) => item.text.toLowerCase().includes(searchKeyword.toLowerCase()));

    // 过滤后没有匹配项，显示提示
    if (visibleTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-tip">没有找到匹配的待办事项</li>';
        stats.textContent = "";
        return;
    }

    // 用 for 循环遍历过滤后的数组，每个待办生成一个列表项
    for (let i = 0; i < visibleTodos.length; i++) {

        // 创建一个新的 <li> 元素
        const li = document.createElement("li");
        li.className = "todo-item";

        // 取出当前这条待办，以及它在原数组中的真实位置
        const currentTodo = visibleTodos[i];
        const realIndex = todos.indexOf(currentTodo);

        // 创建文字部分
        const textSpan = document.createElement("span");
        textSpan.textContent = currentTodo.text;

        // 如果已完成，加上删除线样式
        if (currentTodo.done === true) {
            textSpan.classList.add("todo-done");
        }

        // 创建按钮容器
        const btnGroup = document.createElement("span");

        // 创建"完成"按钮
        const doneBtn = document.createElement("button");
        doneBtn.textContent = currentTodo.done ? "撤销" : "完成";
        doneBtn.className = "done-btn";
        doneBtn.addEventListener("click", () => {
            // 切换完成状态：true 变 false，false 变 true
            todos[realIndex].done = !todos[realIndex].done;
            renderTodos();    // 重新渲染页面
        });

        // 创建"删除"按钮
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "删除";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            // 从原数组中删除这条待办
            // splice(从哪个位置开始, 删几个)
            todos.splice(realIndex, 1);
            renderTodos();    // 重新渲染页面
        });

        // 把按钮放进按钮容器
        btnGroup.appendChild(doneBtn);
        btnGroup.appendChild(deleteBtn);

        // 把文字和按钮容器放进 <li>
        li.appendChild(textSpan);
        li.appendChild(btnGroup);

        // 把 <li> 放进 <ul> 列表
        todoList.appendChild(li);
    }

    // 更新统计信息
    let doneCount = 0;
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].done === true) {
            doneCount = doneCount + 1;
        }
    }
    stats.textContent = "共 " + todos.length + " 项，已完成 " + doneCount + " 项";
};


// ------------------------------------------
// 添加功能：点击按钮，把输入框的内容加到数组里
// ------------------------------------------
addBtn.addEventListener("click", () => {
    let newText = todoInput.value;

    // 如果输入框为空，不添加
    if (newText === "") {
        return;
    }

    // 把新待办添加到数组末尾
    todos.push({ text: newText, done: false });

    // 清空输入框
    todoInput.value = "";

    // 重新渲染页面
    renderTodos();
});


// ------------------------------------------
// 按回车也能添加（不用每次都点按钮）
// ------------------------------------------
todoInput.addEventListener("keydown", (event) => {
    // event.key 是用户按下的键的名称
    if (event.key === "Enter") {
        addBtn.click();    // 模拟点击添加按钮
    }
});


// ------------------------------------------
// 搜索功能：每次输入都更新关键词并重新渲染
// ------------------------------------------
searchInput.addEventListener("input", () => {
    searchKeyword = searchInput.value;
    renderTodos();
});


// ------------------------------------------
// 清空已完成：删除所有 done 为 true 的待办项
// filter 方法：只保留条件为 true 的项，其余丢弃
// ------------------------------------------
clearDoneBtn.addEventListener("click", () => {
    // 只保留"未完成"的项，已完成的全部过滤掉
    todos = todos.filter((item) => item.done === false);
    renderTodos();
});


// 页面加载时，先渲染一次
renderTodos();
