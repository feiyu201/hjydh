function createRecommendationItem(item) {
    const col = document.createElement('div');
    col.classList.add('col-sm-3');

    const widget = document.createElement('div');
    widget.classList.add('xe-widget', 'xe-conversations', 'box2', 'label-info');
    widget.onclick = () => window.open(item.url, '_blank');
    col.appendChild(widget);

    const commentEntry = document.createElement('div');
    commentEntry.classList.add('xe-comment-entry');
    widget.appendChild(commentEntry);

    const userImg = document.createElement('a');
    userImg.classList.add('xe-user-img');
    commentEntry.appendChild(userImg);

    const img = document.createElement('img');
    img.classList.add('lozad', 'img-circle');
    img.width = 40;

     if (item.logo) {
    img.setAttribute('data-src', item.logo);
  } else {
      item.logo=getDomain(item.url)+"favicon.ico";
    img.setAttribute('data-src', item.logo); // 设置默认图片路径
  }

    img.setAttribute('data-src', item.logo);
    img.onerror = function() {
    this.setAttribute('data-src', 'https://www.helloimg.com/images/2022/03/27/RXyWzg.th.jpg'); // 图片加载失败时使用默认图片
  };
    userImg.appendChild(img);

    const comment = document.createElement('div');
    comment.classList.add('xe-comment');
    commentEntry.appendChild(comment);

    const userName = document.createElement('a');
    userName.classList.add('xe-user-name', 'overflowClip_1');
    userName.innerHTML = `<strong>${item.name}</strong>`;
    comment.appendChild(userName);

    const description = document.createElement('p');
    description.classList.add('overflowClip_2');
    description.textContent = item.description;
    comment.appendChild(description);

    return col;
}

function createRecommendationSection(recommendation) {
    const container = document.createElement('div');

    const header = document.createElement('h4');
    header.classList.add('text-gray');
    header.innerHTML =`<i class="linecons-tag" style="margin-right: 7px;" id="${recommendation.id}">${recommendation.title}</i>`;
    container.appendChild(header);

    const row = document.createElement('div');
    row.classList.add('row');
    container.appendChild(row);

    recommendation.items.forEach(item => {
        const recommendationItem = createRecommendationItem(item);
        row.appendChild(recommendationItem);
    });

    return container;
}
/*数据加载*/
let data = null; // 全局变量用于保存数据
let isMenuCreated = false; // 全局变量用于保存菜单是否已经创建的状态

function loadRecommendations() {
    if (!data) { // 如果数据不存在，则加载数据文件
        fetch('../data.json')
            .then(response => response.json())
            .then(result => {
                data = result; // 将数据保存到全局变量中

                const recommendationsContainer = document.getElementById('recommendations-container');
                recommendationsContainer.innerHTML = '';

                data.recommendations.forEach(recommendation => {
                    const recommendationSection = createRecommendationSection(recommendation);
                    recommendationsContainer.appendChild(recommendationSection);
                });

                const lozadObserver = lozad('.lozad');
                lozadObserver.observe();
          

                if (!isMenuCreated) { // 如果菜单还没有被创建，则创建菜单
                    const menuElement = document.getElementById('main-menu');
                    data.recommendations.forEach(recommendation => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<a href="javascript:void(0)" class="smooth"><i class="linecons-star"></i><span class="title">${recommendation.title}</span></a>`;
                        listItem.onclick = function () {
                            smoothScroll(recommendation.id);
                        }
                        menuElement.appendChild(listItem);
                    });
                    isMenuCreated = true; // 将菜单创建状态设置为true
                }
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
        translate.execute(); //进行翻译
        return;
    }

    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = '';

    data.recommendations.forEach(recommendation => {
        const recommendationSection = createRecommendationSection(recommendation);
        recommendationsContainer.appendChild(recommendationSection);
    });

    const lozadObserver = lozad('.lozad');
    lozadObserver.observe();
    translate.execute(); //进行翻译
}

function handleSearch() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = ''; //清空原有数据

    if (!searchText) { // 如果搜索文本为空，则直接恢复原有的建议列表
        loadRecommendations();
        return;
    }

    let hasResult = false; // 标记是否搜索到结果

    data.recommendations.forEach(recommendation => {
        const filteredItems = recommendation.items.filter(item =>
            item.name.toLowerCase().includes(searchText) ||
            item.url.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText)
        );

        if (filteredItems.length > 0) {
            hasResult = true; // 如果有结果，则将标记设置为true

            const filteredRecommendation = { ...recommendation, items: filteredItems };
            const recommendationSection = createRecommendationSection(filteredRecommendation);
            recommendationsContainer.appendChild(recommendationSection);
        }
    });

    const lozadObserver = lozad('.lozad');
    lozadObserver.observe();


    if (!hasResult) { // 如果没有搜索到任何结果，则在页面上显示提示信息
        const noResultDiv = document.createElement('div');
        noResultDiv.classList.add('no-result-div'); // 添加一个类名
        noResultDiv.innerHTML = '没有搜索到相关内容';
        recommendationsContainer.appendChild(noResultDiv);
    }
    translate.execute(); //进行翻译
}


document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);
});

function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}
function getDomain(url) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.protocol}//${parsedUrl.hostname}/`;
}
translate.listener.renderTaskFinish = function(task){
    var langs = translate.language.get('欢聚');
console.log(langs);
if(langs!="欢聚"){
    document.getElementById('search-input').style.display = 'none';
}else{
    document.getElementById('search-input').style.display = 'block';
}

}
document.addEventListener('DOMContentLoaded', loadRecommendations);

