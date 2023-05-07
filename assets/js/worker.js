// 定义一个 Web Worker
onmessage = function(event) {
    const siteLaunchDate = new Date("2023-04-27T16:10:00");
    const timeDiff = event.data - siteLaunchDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // 向主线程发送结果
    postMessage({days: days, hours: hours, minutes: minutes, seconds: seconds});
};
