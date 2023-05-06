$(main);

function main() {
    const PHI = (1 + Math.sqrt(5)) / 2,
        maxGeneration = navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? 5 : 6,
        frameDuration = 1000 / 60,
        duration = 3000,
        rotationSpeed = 0.3,
        totalIterations = Math.floor(duration / frameDuration),
        maxBaseSize = 100,
        baseSizeSpeed = 0.02;
    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        shapes = [],
        sizeVariation,
        iteration = 0,
        animationDirection = 1,
        sizeVariationRange = 0.15,
        baseRotation = 0,
        baseSize = 50,
        c1 = 43,
        c1S = 1,
        c2 = 205,
        c2S = 1,
        c3 = 255,
        c3S = 1;

    // 初始化canvas大小为100%全屏
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function Shape(gen, x, y, size, rotation) {
        this.generation = gen;
        this.size = size;
        this.rotation = -rotation;
        this.start = {
            x: x,
            y: y,
        };
        this.end = {
            x_1: this.start.x + Math.cos(degToRad(this.rotation)) * this.size,
            y_1: this.start.y + Math.sin(degToRad(this.rotation)) * this.size,
            x_2: this.start.x + Math.cos(degToRad(this.rotation + (360 / 3))) * this.size,
            y_2: this.start.y + Math.sin(degToRad(this.rotation + (360 / 3))) * this.size,
            x_3: this.start.x + Math.cos(degToRad(this.rotation + (360 / 3) * 2)) * this.size,
            y_3: this.start.y + Math.sin(degToRad(this.rotation + (360 / 3) * 2)) * this.size,
        };

        this.init();
    }

    Shape.prototype.init = function () {
        if (this.generation < maxGeneration) {
            var gen = this.generation + 1,
                newSize = this.size * sizeVariation,
                newRotation = this.rotation;

            shapes.push(new Shape(gen, this.end.x_1, this.end.y_1, newSize, newRotation));
            shapes.push(new Shape(gen, this.end.x_2, this.end.y_2, newSize, newRotation));
            shapes.push(new Shape(gen, this.end.x_3, this.end.y_3, newSize, newRotation));
        }
        this.draw();
    };

    Shape.prototype.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_1, this.end.y_1);
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_2, this.end.y_2);
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x_3, this.end.y_3);
//ctx.closePath();
        ctx.strokeStyle = "rgba(" + c1 + "," + c2 + "," + c3 + "," + 1 / this.generation / 5 + ")";
        ctx.stroke();
//ctx.fill();
    };

    function animate() {
// 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

// 设置全局混合模式为source-over
        ctx.globalCompositeOperation = "source-over";
// 填充半透明黑色矩形
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
// 恢复混合模式为lighter
        ctx.globalCompositeOperation = "lighter";

// 绘制图形
        shapes = [];
        shapes.push(new Shape(0, canvas.width / 2, canvas.height / 2, baseSize, baseRotation));
        changeColor();
        iteration++;
        if (baseSize < maxBaseSize) baseSize += baseSizeSpeed;
        baseRotation += rotationSpeed;
        sizeVariation = easeInOutSine(iteration, 1 - sizeVariationRange * animationDirection, sizeVariationRange * 2 * animationDirection, totalIterations);
        if (iteration >= totalIterations) {
            iteration = 0;
            animationDirection *= -1;
        }
        requestAnimationFrame(animate);
    }

    function changeColor() {
        c1 += c1S;
        if (c1 > 255 || c1 < 0) c1S *= -1, c1 += c1S;

        c2 += c2S;
        if (c2 > 255 || c2 < 0) c2S *= -1, c2 += c2S;

        c3 += c3S;
        if (c3 > 255 || c3 < 0) c3S *= -1, c3 += c3S;
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
        return -changeInValue / 2 * (Math.cos(Math.PI * currentIteration / totalIterations) - 1) + startValue;
    }

// 添加监听窗口大小变化的事件
    /*
    window.addEventListener("resize", function () {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
*/
// 添加监听滚动条滚动的事件
    window.addEventListener("scroll", function () {
        canvas.style.top = window.pageYOffset + "px";
    });

// 开始动画
    animate();
}






