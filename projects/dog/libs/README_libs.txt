本資料夾已內含 3D Demo 所需相依:

libs/
├─ three/  (three@0.160.0)
│  ├─ build/three.module.js
│  └─ examples/jsm/  (controls / loaders / utils / libs:含 draco、basis、ammo.wasm.js、stats)
└─ @fortawesome/fontawesome-free/  (css/all.min.css + webfonts)

注意:此 Three.js 版本為 0.160.0。若與你原專案撰寫時的版本差異過大,
個別 addon API 可能需微調(但 OrbitControls / GLTFLoader / DRACO / KTX2 等載入器
路徑與基本用法在此版本皆相容)。
