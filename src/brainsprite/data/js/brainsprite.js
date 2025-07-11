/*! brainsprite v0.14.3 */
function displayFloat(t, e) {
    var a = parseFloat(t).toFixed(e);
    return a.indexOf(".") === -1 ? a + "." : a.replace(/0+$/, "");
}
function initBrain(t) {
    var e = {
            smooth: !1,
            flagValue: !1,
            colorBackground: "#000000",
            flagCoordinates: !1,
            origin: { X: 0, Y: 0, Z: 0 },
            voxelSize: 1,
            affine: !1,
            heightColorBar: 0.04,
            sizeFont: 0.075,
            colorFont: "#FFFFFF",
            nbDecimals: 3,
            crosshair: !1,
            colorCrosshair: "#0000FF",
            sizeCrosshair: 0.9,
            title: !1,
            numSlice: !1,
            onclick: "",
            radiological: !1,
            showLR: !0,
        },
        a = Object.assign({}, e, t);
    return (
        typeof a.affine == "boolean" &&
            a.affine === !1 &&
            (a.affine = [
                [a.voxelSize, 0, 0, -a.origin.X],
                [0, a.voxelSize, 0, -a.origin.Y],
                [0, 0, a.voxelSize, -a.origin.Z],
                [0, 0, 0, 1],
            ]),
        a.flagCoordinates ? (a.spaceFont = 0.1) : (a.spaceFont = 0),
        (a.coordinatesSlice = { X: 0, Y: 0, Z: 0 }),
        (a.widthCanvas = { X: 0, Y: 0, Z: 0, max: 0 }),
        (a.heightCanvas = { X: 0, Y: 0, Z: 0, max: 0 }),
        a
    );
}
function initCanvas(t, e) {
    return (
        (t.canvas = document.getElementById(e)),
        (t.context = t.canvas.getContext("2d")),
        (t.context.imageSmoothingEnabled = t.smooth),
        (t.canvasY = document.createElement("canvas")),
        (t.contextY = t.canvasY.getContext("2d")),
        (t.canvasZ = document.createElement("canvas")),
        (t.contextZ = t.canvasZ.getContext("2d")),
        (t.canvasRead = document.createElement("canvas")),
        (t.contextRead = t.canvasRead.getContext("2d")),
        (t.canvasRead.width = 1),
        (t.canvasRead.height = 1),
        (t.planes = {}),
        (t.planes.canvasMaster = document.createElement("canvas")),
        (t.planes.contextMaster = t.planes.canvasMaster.getContext("2d")),
        t
    );
}
function initSprite(t, e, a) {
    return (
        (t.sprite = document.getElementById(e)),
        (t.nbCol = t.sprite.width / a.Y),
        (t.nbRow = t.sprite.height / a.Z),
        (t.nbSlice = { X: typeof a.X < "u" ? a.X : t.nbCol * t.nbRow, Y: a.Y, Z: a.Z }),
        t.numSlice === !1 && (t.numSlice = { X: Math.floor(t.nbSlice.X / 2), Y: Math.floor(t.nbSlice.Y / 2), Z: Math.floor(t.nbSlice.Z / 2) }),
        t
    );
}
function initOverlay(t, e, a) {
    return (
        (t.overlay.opacity = typeof t.overlay.opacity < "u" ? t.overlay.opacity : 1),
        (t.overlay.sprite = document.getElementById(e)),
        (t.overlay.nbCol = t.overlay.sprite.width / a.Y),
        (t.overlay.nbRow = t.overlay.sprite.height / a.Z),
        (t.overlay.nbSlice = { X: typeof a.X < "u" ? a.X : t.overlay.nbCol * t.overlay.nbRow, Y: a.Y, Z: a.Z }),
        t
    );
}
function initColorMap(t) {
    return (
        (t.hide = typeof t.hide < "u" ? t.hide : !1),
        (t.img = document.getElementById(t.img)),
        (t.canvas = document.createElement("canvas")),
        (t.context = t.canvas.getContext("2d")),
        (t.canvas.width = t.img.width),
        (t.canvas.height = t.img.height),
        t.context.drawImage(t.img, 0, 0, t.img.width, t.img.height, 0, 0, t.img.width, t.img.height),
        t
    );
}
function brainsprite(t) {
    let e = initBrain(t);
    (e = initCanvas(e, t.canvas)), (e = initSprite(e, t.sprite, t.nbSlice)), t.overlay && (e = initOverlay(e, t.overlay.sprite, t.overlay.nbSlice)), t.colorMap && (e.colorMap = initColorMap(t.colorMap));
    let a = function (o, n) {
            if (!n) return NaN;
            let i = NaN,
                l = 1 / 0;
            const c = n.canvas.width,
                d = n.context.getImageData(0, 0, c, 1).data;
            for (let s = 0; s < c; s++) {
                const r = Math.abs(d[s * 4] - o[0]) + Math.abs(d[s * 4 + 1] - o[1]) + Math.abs(d[s * 4 + 2] - o[2]);
                r < l && ((i = s), (l = r));
            }
            return (i * (n.max - n.min)) / (c - 1) + n.min;
        },
        p = function () {
            const o = {};
            if (e.overlay && !e.nanValue)
                try {
                    (o.XW = Math.round(e.numSlice.X % e.nbCol)),
                        (o.XH = Math.round((e.numSlice.X - o.XW) / e.nbCol)),
                        e.contextRead.clearRect(0, 0, 1, 1),
                        e.contextRead.drawImage(e.overlay.sprite, o.XW * e.nbSlice.Y + e.numSlice.Y, o.XH * e.nbSlice.Z + e.nbSlice.Z - e.numSlice.Z - 1, 1, 1, 0, 0, 1, 1);
                    const n = e.contextRead.getImageData(0, 0, 1, 1).data;
                    n[3] === 0 ? (e.voxelValue = NaN) : (e.voxelValue = a(n, e.colorMap));
                } catch (n) {
                    console.warn(n.message), (e.nanValue = !0), (e.voxelValue = NaN);
                }
            else e.voxelValue = NaN;
        },
        M = function (o, n, i) {
            for (let l = 0; l < 3; ++l) o[l] = i[0] * n[l][0] + i[1] * n[l][1] + i[2] * n[l][2] + i[3] * n[l][3];
        };
    const C = [0, 0, 0];
    let Z = function () {
        M(C, e.affine, [e.numSlice.X + 1, e.numSlice.Y + 1, e.numSlice.Z + 1, 1]), (e.coordinatesSlice.X = C[0]), (e.coordinatesSlice.Y = C[1]), (e.coordinatesSlice.Z = C[2]);
    };
    return (
        (e.init = function () {
            let o = e.nbSlice.X,
                n = e.nbSlice.Y,
                i = e.nbSlice.Z;
            e.resize(),
                (e.planes.canvasMaster.width = e.sprite.width),
                (e.planes.canvasMaster.height = e.sprite.height),
                (e.planes.contextMaster.globalAlpha = 1),
                e.planes.contextMaster.drawImage(e.sprite, 0, 0, e.sprite.width, e.sprite.height, 0, 0, e.sprite.width, e.sprite.height),
                e.overlay && ((e.planes.contextMaster.globalAlpha = e.overlay.opacity), e.planes.contextMaster.drawImage(e.overlay.sprite, 0, 0, e.overlay.sprite.width, e.overlay.sprite.height, 0, 0, e.sprite.width, e.sprite.height)),
                (e.planes.canvasX = document.createElement("canvas")),
                (e.planes.contextX = e.planes.canvasX.getContext("2d")),
                (e.planes.canvasX.width = n),
                (e.planes.canvasX.height = i),
                (e.planes.canvasY = document.createElement("canvas")),
                (e.planes.contextY = e.planes.canvasY.getContext("2d")),
                (e.planes.canvasY.width = o),
                (e.planes.canvasY.height = i),
                (e.planes.canvasZ = document.createElement("canvas")),
                (e.planes.contextZ = e.planes.canvasZ.getContext("2d")),
                (e.planes.canvasZ.width = o),
                (e.planes.canvasZ.height = n),
                e.planes.contextZ.rotate(-Math.PI / 2),
                e.planes.contextZ.translate(-n, 0),
                p(),
                Z(),
                (e.numSlice.X = Math.round(e.numSlice.X)),
                (e.numSlice.Y = Math.round(e.numSlice.Y)),
                (e.numSlice.Z = Math.round(e.numSlice.Z));
        }),
        (e.resize = function () {
            let o = e.canvas.parentElement.clientWidth,
                n = e.nbSlice.X,
                i = e.nbSlice.Y,
                l = e.nbSlice.Z;
            const c = Math.floor(o * (i / (2 * n + i))),
                d = Math.floor(o * (n / (2 * n + i))),
                s = Math.floor(o * (n / (2 * n + i)));
            if (c === e.widthCanvas.X && d === e.widthCanvas.Y && s === e.widthCanvas.Z) return !1;
            (e.widthCanvas.X = c),
                (e.widthCanvas.Y = d),
                (e.widthCanvas.Z = s),
                (e.widthCanvas.max = Math.max(c, d, s)),
                (e.heightCanvas.X = Math.floor((e.widthCanvas.X * l) / i)),
                (e.heightCanvas.Y = Math.floor((e.widthCanvas.Y * l) / n)),
                (e.heightCanvas.Z = Math.floor((e.widthCanvas.Z * i) / n)),
                (e.heightCanvas.max = Math.max(e.heightCanvas.X, e.heightCanvas.Y, e.heightCanvas.Z));
            let r = e.widthCanvas.X + e.widthCanvas.Y + e.widthCanvas.Z;
            return (
                e.canvas.width !== r && ((e.canvas.width = r), (e.canvas.height = Math.round((1 + e.spaceFont) * e.heightCanvas.max)), (e.context.imageSmoothingEnabled = e.smooth)),
                (e.sizeFontPixels = Math.round(e.sizeFont * e.heightCanvas.max)),
                (e.context.font = e.sizeFontPixels + "px Arial"),
                !0
            );
        }),
        (e.draw = function (o, n) {
            let i = {},
                l,
                c,
                d = Math.ceil(((1 - e.sizeCrosshair) * e.nbSlice.X) / 2),
                s = Math.ceil(((1 - e.sizeCrosshair) * e.nbSlice.Y) / 2),
                r = Math.ceil(((1 - e.sizeCrosshair) * e.nbSlice.Z) / 2),
                u = e.nbSlice.Y,
                f = e.nbSlice.Z,
                v;
            switch (n) {
                case "X":
                    if (
                        ((i.XW = e.numSlice.X % e.nbCol),
                        (i.XH = (e.numSlice.X - i.XW) / e.nbCol),
                        e.planes.contextX.drawImage(e.planes.canvasMaster, i.XW * u, i.XH * f, u, f, 0, 0, u, f),
                        e.crosshair && ((e.planes.contextX.fillStyle = e.colorCrosshair), e.planes.contextX.fillRect(e.numSlice.Y, r, 1, f - 2 * r), e.planes.contextX.fillRect(s, f - e.numSlice.Z - 1, u - 2 * s, 1)),
                        (e.context.fillStyle = e.colorBackground),
                        e.context.fillRect(0, 0, e.widthCanvas.X, e.canvas.height),
                        e.context.drawImage(e.planes.canvasX, 0, 0, u, f, 0, (e.heightCanvas.max - e.heightCanvas.X) / 2, e.widthCanvas.X, e.heightCanvas.X),
                        e.title && ((e.context.fillStyle = e.colorFont), e.context.fillText(e.title, Math.round(e.widthCanvas.X / 10), Math.round(e.heightCanvas.max * e.heightColorBar + e.sizeFontPixels / 4))),
                        e.flagValue)
                    ) {
                        const h = isNaN(e.voxelValue) ? "no value" : "value = " + displayFloat(e.voxelValue, e.nbDecimals);
                        (e.context.fillStyle = e.colorFont), e.context.fillText(h, Math.round(e.widthCanvas.X / 10), Math.round(e.heightCanvas.max * e.heightColorBar * 2 + (3 / 4) * e.sizeFontPixels));
                    }
                    e.flagCoordinates &&
                        ((l = "x = " + Math.round(e.coordinatesSlice.X)),
                        (c = e.context.measureText(l).width),
                        (e.context.fillStyle = e.colorFont),
                        e.context.fillText(l, e.widthCanvas.X / 2 - c / 2, Math.round(e.canvas.height - e.sizeFontPixels / 2)));
                    break;
                case "Y":
                    for (e.context.fillStyle = e.colorBackground, e.context.fillRect(e.widthCanvas.X, 0, e.widthCanvas.Y, e.canvas.height), v = 0; v < e.nbSlice.X; v++) {
                        let h = v % e.nbCol,
                            x = (v - h) / e.nbCol;
                        e.planes.contextY.drawImage(e.planes.canvasMaster, h * e.nbSlice.Y + e.numSlice.Y, x * e.nbSlice.Z, 1, e.nbSlice.Z, v, 0, 1, e.nbSlice.Z);
                    }
                    if (
                        (e.crosshair &&
                            ((e.planes.contextY.fillStyle = e.colorCrosshair), e.planes.contextY.fillRect(e.numSlice.X, r, 1, e.nbSlice.Z - 2 * r), e.planes.contextY.fillRect(d, e.nbSlice.Z - e.numSlice.Z - 1, e.nbSlice.X - 2 * d, 1)),
                        e.context.drawImage(e.planes.canvasY, 0, 0, e.nbSlice.X, e.nbSlice.Z, e.widthCanvas.X, (e.heightCanvas.max - e.heightCanvas.Y) / 2, e.widthCanvas.Y, e.heightCanvas.Y),
                        e.colorMap && !e.colorMap.hide)
                    ) {
                        e.context.drawImage(
                            e.colorMap.img,
                            0,
                            0,
                            e.colorMap.img.width,
                            1,
                            Math.round(e.widthCanvas.X + e.widthCanvas.Y * 0.2),
                            Math.round((e.heightCanvas.max * e.heightColorBar) / 2),
                            Math.round(e.widthCanvas.Y * 0.6),
                            Math.round(e.heightCanvas.max * e.heightColorBar)
                        ),
                            (e.context.fillStyle = e.colorFont);
                        const h = displayFloat(e.colorMap.min, e.nbDecimals),
                            x = displayFloat(e.colorMap.max, e.nbDecimals);
                        e.context.fillText(h, e.widthCanvas.X + e.widthCanvas.Y * 0.2 - e.context.measureText(h).width / 2, Math.round(e.heightCanvas.max * e.heightColorBar * 2 + (3 / 4) * e.sizeFontPixels)),
                            e.context.fillText(x, e.widthCanvas.X + e.widthCanvas.Y * 0.8 - e.context.measureText(x).width / 2, Math.round(e.heightCanvas.max * e.heightColorBar * 2 + (3 / 4) * e.sizeFontPixels));
                    }
                    if (
                        (e.flagCoordinates &&
                            ((e.context.font = e.sizeFontPixels + "px Arial"),
                            (e.context.fillStyle = e.colorFont),
                            (l = "y = " + Math.round(e.coordinatesSlice.Y)),
                            (c = e.context.measureText(l).width),
                            e.context.fillText(l, e.widthCanvas.X + e.widthCanvas.Y / 2 - c / 2, Math.round(e.canvas.height - e.sizeFontPixels / 2))),
                        e.showLR)
                    ) {
                        const h = !!e.radiological,
                            x = Math.round(e.canvas.height / 2),
                            { font: m, textAlign: w, textBaseline: S } = e.context;
                        (e.context.font = `${e.sizeFontPixels}px Arial`), (e.context.textAlign = "center"), (e.context.textBaseline = "middle"), (e.context.fillStyle = e.colorFont);
                        const X = h ? "R" : "L",
                            Y = h ? "L" : "R",
                            g = e.widthCanvas.Y * 0.05;
                        e.context.fillText(X, e.widthCanvas.X + g, x), e.context.fillText(Y, e.widthCanvas.X + e.widthCanvas.Y - g, x), (e.context.font = m), (e.context.textAlign = w), (e.context.textBaseline = S);
                    }
                    break;
                case "Z":
                    for (e.context.fillStyle = e.colorBackground, e.context.fillRect(e.widthCanvas.X + e.widthCanvas.Y, 0, e.widthCanvas.Z, e.canvas.height), v = 0; v < e.nbSlice.X; v++) {
                        let h = v % e.nbCol,
                            x = (v - h) / e.nbCol;
                        e.planes.contextZ.drawImage(e.planes.canvasMaster, h * e.nbSlice.Y, x * e.nbSlice.Z + e.nbSlice.Z - e.numSlice.Z - 1, e.nbSlice.Y, 1, 0, v, e.nbSlice.Y, 1);
                    }
                    if (
                        (e.crosshair && ((e.planes.contextZ.fillStyle = e.colorCrosshair), e.planes.contextZ.fillRect(s, e.numSlice.X, e.nbSlice.Y - 2 * s, 1), e.planes.contextZ.fillRect(e.numSlice.Y, d, 1, e.nbSlice.X - 2 * d)),
                        e.context.drawImage(e.planes.canvasZ, 0, 0, e.nbSlice.X, e.nbSlice.Y, e.widthCanvas.X + e.widthCanvas.Y, (e.heightCanvas.max - e.heightCanvas.Z) / 2, e.widthCanvas.Z, e.heightCanvas.Z),
                        e.flagCoordinates &&
                            ((l = "z = " + Math.round(e.coordinatesSlice.Z)),
                            (c = e.context.measureText(l).width),
                            (e.context.fillStyle = e.colorFont),
                            e.context.fillText(l, e.widthCanvas.X + e.widthCanvas.Y + e.widthCanvas.Z / 2 - c / 2, Math.round(e.canvas.height - e.sizeFontPixels / 2))),
                        e.showLR)
                    ) {
                        const h = !!e.radiological,
                            x = Math.round(e.canvas.height / 2),
                            { font: m, textAlign: w, textBaseline: S } = e.context;
                        (e.context.font = `${e.sizeFontPixels}px Arial`), (e.context.textAlign = "center"), (e.context.textBaseline = "middle"), (e.context.fillStyle = e.colorFont);
                        const X = h ? "R" : "L",
                            Y = h ? "L" : "R",
                            g = e.widthCanvas.Y * 0.05;
                        e.context.fillText(X, e.widthCanvas.X + e.widthCanvas.Y + g, x),
                            e.context.fillText(Y, e.widthCanvas.X + e.widthCanvas.Y + e.widthCanvas.Z - g, x),
                            (e.context.font = m),
                            (e.context.textAlign = w),
                            (e.context.textBaseline = S);
                    }
            }
        }),
        (e.clickBrain = function (o) {
            let n = e.canvas.getBoundingClientRect(),
                i = o.clientX - n.left,
                l = o.clientY - n.top,
                c,
                d;
            if (i < e.widthCanvas.X)
                (c = Math.round((e.nbSlice.Y - 1) * (i / e.widthCanvas.X))),
                    (d = Math.round(((e.nbSlice.Z - 1) * ((e.heightCanvas.max + e.heightCanvas.X) / 2 - l)) / e.heightCanvas.X)),
                    (e.numSlice.Y = Math.max(Math.min(c, e.nbSlice.Y - 1), 0)),
                    (e.numSlice.Z = Math.max(Math.min(d, e.nbSlice.Z - 1), 0));
            else if (i < e.widthCanvas.X + e.widthCanvas.Y) {
                i = i - e.widthCanvas.X;
                let s = Math.round((e.nbSlice.X - 1) * (i / e.widthCanvas.Y)),
                    r = Math.round(((e.nbSlice.Z - 1) * ((e.heightCanvas.max + e.heightCanvas.X) / 2 - l)) / e.heightCanvas.X);
                (e.numSlice.X = Math.max(Math.min(s, e.nbSlice.X - 1), 0)), (e.numSlice.Z = Math.max(Math.min(r, e.nbSlice.Z - 1), 0));
            } else {
                i = i - e.widthCanvas.X - e.widthCanvas.Y;
                let s = Math.round((e.nbSlice.X - 1) * (i / e.widthCanvas.Z)),
                    r = Math.round(((e.nbSlice.Y - 1) * ((e.heightCanvas.max + e.heightCanvas.Z) / 2 - l)) / e.heightCanvas.Z);
                (e.numSlice.X = Math.max(Math.min(s, e.nbSlice.X - 1), 0)), (e.numSlice.Y = Math.max(Math.min(r, e.nbSlice.Y - 1), 0));
            }
            p(), Z(), e.drawAll(), e.onclick && e.onclick(o);
        }),
        (e.drawAll = function () {
            e.draw(e.numSlice.X, "X"), e.draw(e.numSlice.Y, "Y"), e.draw(e.numSlice.Z, "Z");
        }),
        e.canvas.addEventListener("click", e.clickBrain, !1),
        e.canvas.addEventListener(
            "mousedown",
            function () {
                e.canvas.addEventListener("mousemove", e.clickBrain, !1);
            },
            !1
        ),
        e.canvas.addEventListener(
            "mouseup",
            function () {
                e.canvas.removeEventListener("mousemove", e.clickBrain, !1);
            },
            !1
        ),
        e.sprite.addEventListener("load", function () {
            e.init(), e.drawAll();
        }),
        e.overlay &&
            e.overlay.sprite.addEventListener("load", function () {
                e.init(), e.drawAll();
            }),
        e.init(),
        e.drawAll(),
        window.addEventListener("resize", function () {
            e.resize() && e.drawAll();
        }),
        e
    );
}
