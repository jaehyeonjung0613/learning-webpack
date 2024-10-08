# 🎉 learning-webpack

[웹팩 가이드라인](https://webpack.js.org/guides/) 따라해보면서 학습해보기

## 💡 필요성 및 목적

개발 역량을 쌓기 위해 [우아한테크코스](https://github.com/woowacourse) 미션에 도전하기 시작하였다.

첫 미션으로 [perf-basecamp](https://github.com/woowacourse/perf-basecamp) 문제풀이를 하였는데,
react와 webpack을 활용하여 웹 성능 최적화하는 문제로 보였다.

react에 대해 어느 정도 알고 있었지만 webpack은 생소하여 부족한 webpack 개념을 채우고 사용법을 알아가고자 프로젝트를 생성하게되었다.

학습 방법은 웹팩 가이드라인을 직접 따라해볼 것이며,
가이드라인 외에도 학습하면서 실험해보고 싶은 것이 있으면 할 예정이다.

## 🚀 학습 과정

### Getting Started

- [x] Basic Setup
- [x] Creating a Bundle
- [x] Modules
- [x] Using a Configuration
- [x] NPM Scripts
- [x] Conclusion

### Asset Management

- [x] Setup
- [x] Loading CSS
- [x] Loading Images
- [x] Loading Fonts
- [x] Loading Data
- [x] Global Assets

### Output Management

- [x] Preparation
- [x] Setting up HtmlWebpackPlugin
- [x] Cleaning up the /dist folder
- [x] The Manifest
- [x] Conclusion

### Development

- [x] Using source maps
- [x] Choosing a Development Tool
- [x] Adjusting Your Text Editor
- [x] Conclusion

### Code Splitting

- [x] Entry Points
- [x] Prevent Duplication
- [x] Dynamic Imports
- [x] Prefetching/Preloading modules
- [x] Bundle Analysis

### Caching

- [x] Output Filenames
- [x] Extracting Boilerplate
- [x] Module Identifiers

### Autoring Libraries

- [x] Authoring a Library
- [x] Webpack Configuration
- [x] Expose the Library
- [x] Externalize Lodash
- [x] Final Steps

### Environment Variables

## 🧪 실험

### 특정 파일들 한 폴더에 bundle

에셋과 같은 파일과 소스 파일을 분리하여 bundle 할 수 있는지 확인해본다.

#### 소스 구조와 bundle된 구조가 동일한지 확인

소스에 에셋 폴더를 생성하고 bundle한다면, 구조가 유지되는지 확인

<pre>
<code style="color:#a5cee1"><span>    src</span>
<span style="color:#9df29d">+   |- public</span>
<span style="color:#9df29d">+     |- icon.png</span>
<span style="color:#f79494">-   |- icon.png</span>
</code>
</pre>

먼저 위와 같이 public 폴더 생성 후 에셋 파일들을 이동시킨다.

```typescript
import _ from 'lodash';
import './style.css';
import Icon from './public/icon.png';
import Data from './data.xml';
import Notes from './data.csv';
import toml from './data.toml';
import yaml from './data.yaml';
import json from './data.json5';
```

변경된 파일 경로와 동일하게 import 경로를 수정한다.

```bash
> learning-webpack@0.0.0 build
> webpack

assets by status 39 KiB [cached] 1 asset
asset bundle.js 75.8 KiB [emitted] [minimized] (name: main) 1 related asset
runtime modules 2.28 KiB 8 modules
javascript modules 543 KiB
  modules by path ./node_modules/ 539 KiB
    modules by path ./node_modules/style-loader/dist/runtime/*.js 5.84 KiB 6 modules
    modules by path ./node_modules/css-loader/dist/runtime/*.js 2.31 KiB 2 modules
    + 1 module
  modules by path ./src/ 3.38 KiB
    modules by path ./src/*.css 1.78 KiB 2 modules
    + 3 modules
json modules 565 bytes
  ./src/data.toml 188 bytes [built] [code generated]
  ./src/data.yaml 188 bytes [built] [code generated]
  ./src/data.json5 189 bytes [built] [code generated]
./src/public/icon.png 42 bytes (javascript) 39 KiB (asset) [built] [code generated]
...
```

<img src="https://github.com/user-attachments/assets/9d704291-0ddb-4b69-9fd0-49eda256aad9" />

빌드 수행 후 결과를 확인하였지만, 여전히 에셋과 분리가 안되어있는걸 볼 수 있다.

#### webpack config 옵션 확인

웹팩 설정 옵션을 찾아보는 중 이와 같은 상황을 위해 Rule.generator 있다고 한다.

실제로 작동하는지 확인보도록 한다.

```javascript
// webpack.config.js
{
  ...
  module: {
    rules: [
      {
        ...
        generator: {
          filename: '',
          publicPath: '',
          outputPath: ''
        },
      }
    ]
  }
}
```

Rule.generator에 다양한 옵션이 있지만, 그 중 현재 실험과 관련된 옵션만 다룬다면 위와 같다.

|    옵션    | 설명                                         |
| :--------: | :------------------------------------------- |
|  filename  | bundle 시 파일 경로                          |
| publicPath | bundle 소스 앞 경로(prefix 기능과 유사) 추가 |
| outputPath | bundle 파일 경로(bundle 소스 path 적용 x)    |

얼핏 보면 filename과 outputPath의 기능이 동일하다고 생각할 수 있는데, 약간의 차이점이 있다.

filename 설정은 bundle 에셋 이동과 bundle 소스 path 적용까지 하지만, outputPath는 bundle 에셋 이동만 적용한다는 점이 다르다.

```javascript
// webpack.config.js
{
  ...
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'public/[hash][ext]',
        },
      },
    ]
  }
}
```

filename 옵션을 통해 public 폴더 밑에 에셋 파일을 생성하려면 위와 같이 설정하면된다.

[hash]는 bundle 후 생성된 파일명을 의미하고 [ext](. 포함)은 확장자를 의미한다.

<img src="https://github.com/user-attachments/assets/547c9dfc-7b91-4bb6-958a-928f6c944041" />
<br />
<img src="https://github.com/user-attachments/assets/caac048e-a417-4969-9e84-f2789171248c" />

위와 같이 에셋 이동과 bundle 소스 path가 잘 적용되어 나온 것을 볼 수 있다.

```javascript
// webpack.config.js
{
  ...
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          outputPath: 'public/',
        },
      },
    ]
  }
}
```

outputPath 옵션 설정은 위와 같이 설정하면된다.

<img src="https://github.com/user-attachments/assets/2fcb053f-6d1f-4a2a-b5a3-da9797eb101f">
<br />
<img src="https://github.com/user-attachments/assets/b9ca87d7-e9ea-4dd2-bb58-4370931e1381">

반면 outputPath는 에셋 이동이 되었음에도 불구하구 실제 실행하였을때 리소스를 못가져오고있다.

<img src="https://github.com/user-attachments/assets/6d31611b-713b-4e7a-a76e-871feff6ca23" />

해당 리소스 경로를 보았을때, 에셋 경로인 public/이 아닌 bundle 위치로 조회하는 것을 볼 수 있다.

```javascript
// webpack.config.js
{
  ...
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'public/[hash][ext]',
        },
      },
    ]
  }
},
{
  ...
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          publicPath: 'public/',
          outputPath: 'public/',
        },
      },
    ]
  }
}
```

따라서 위 옵션들을 사용하였을때 솔루션을 적용할 수 있는 방법은 위와 두 가지가 있다.

filename은 에셋 이동에 대한 모든 기능이 있으니 그대로 사용하면 되고, outputPath의 경우 에셋 이동 기능만 있으니 bundle 소스 앞 경로에 설정된 url를 적용하는 publicPath를 같이 사용하면 된다.

### Typescript Path Alias 설정

typescript에는 import 경로를 줄일 수 있도록 path alias 기능이 존재한다.

보통 <b>@{folder}</b>로 쓰는 경우가 많은데,
webpack module loader 설정에서 정규식 대상(test:)으로 path alias를 인식하는지 확인해본다.

```json
// tsconfig.json
{
  ...
  "baseUrl": "./"                                  /* Specify the base directory to resolve non-relative module names. */,
  "paths": {
    "@public/*": ["src/public/*"]
  }                                      /* Specify a set of entries that re-map imports to additional lookup locations. */,
  ...
}
```

```typescript
import _ from 'lodash';
import './style.css';
import Icon from '@public/icon.png';
import Data from './data.xml';
import Notes from './data.csv';
import toml from './data.toml';
import yaml from './data.yaml';
import json from './data.json5';
```

먼저 typescript path alias 사용하기 위해 위와 같이
tsconfig.json과 index.ts 파일을 수정한다.

```bash
...
ERROR in ./src/index.ts 3:0-36
Module not found: Error: Can't resolve '@public/icon.png' in 'D:\jaehyeonjung\learning-webpack\src'
resolve '@public/icon.png' in 'D:\jaehyeonjung\learning-webpack\src'
  Parsed request is a module
  using description file: D:\jaehyeonjung\learning-webpack\package.json (relative path: ./src)
    Field 'browser' doesn't contain a valid alias configuration
    resolve as module
      D:\jaehyeonjung\learning-webpack\src\node_modules doesn't exist or is not a directory
      looking for modules in D:\jaehyeonjung\learning-webpack\node_modules
        single file module
          using description file: D:\jaehyeonjung\learning-webpack\package.json (relative path: ./node_modules/@public/icon.png)
            no extension
              Field 'browser' doesn't contain a valid alias configuration
              D:\jaehyeonjung\learning-webpack\node_modules\@public\icon.png doesn't exist
            .js
              Field 'browser' doesn't contain a valid alias configuration
              D:\jaehyeonjung\learning-webpack\node_modules\@public\icon.png.js doesn't exist
            .ts
              Field 'browser' doesn't contain a valid alias configuration
              D:\jaehyeonjung\learning-webpack\node_modules\@public\icon.png.ts doesn't exist
        D:\jaehyeonjung\learning-webpack\node_modules\@public\icon.png doesn't exist
      D:\jaehyeonjung\node_modules doesn't exist or is not a directory
      D:\node_modules doesn't exist or is not a directory

webpack 5.95.0 compiled with 1 error and 1 warning in 9424 ms
```

이후 빌드를 시도하였지만 실패하는 것을 볼 수 있다.

ts-loader에서 path alias을 인식하지 못해 모듈로 불러왔으나 존재하지않은 모듈로 인해 build가 실패했다는 내용이다.

여러 해결할 수 있는 방법이 있지만 그 중 ts-loader에서 소개하고있는 plugin 설정을 이용할 것이다.

<img src="https://github.com/user-attachments/assets/28e8b5e3-5646-4154-ab2a-70fbe57f4b4e" />

방법은 간단하다. 위에 처럼 **tsconfig-paths-webpack-plugin**을 설치한 후에 plugins에 추가 설정만 하면된다.

```bash
npm i -D tsconfig-paths-webpack-plugin
```

```javascript
// webpack.config.js
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  ...
  resolve: {
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  ...
};
```

```bash
> learning-webpack@0.0.0 build
> webpack

asset bundle.js 75.8 KiB [emitted] [minimized] (name: main) 1 related asset
asset public/a1af828b4e65d37668e1.png 39 KiB [emitted] [immutable] [from: src/public/icon.png] (auxiliary name: main)
runtime modules 2.28 KiB 8 modules
javascript modules 543 KiB
  modules by path ./node_modules/ 539 KiB
    modules by path ./node_modules/style-loader/dist/runtime/*.js 5.84 KiB 6 modules
    modules by path ./node_modules/css-loader/dist/runtime/*.js 2.31 KiB 2 modules
    + 1 module
  modules by path ./src/ 3.38 KiB
    modules by path ./src/*.css 1.78 KiB 2 modules
    + 3 modules
json modules 565 bytes
  ./src/data.toml 188 bytes [built] [code generated]
  ./src/data.yaml 188 bytes [built] [code generated]
  ./src/data.json5 189 bytes [built] [code generated]
./src/public/icon.png 42 bytes (javascript) 39 KiB (asset) [built] [code generated]
```

빌드가 성공적으로 완료된 것을 볼 수 있다.

### Bundle Analysis analyse

webpack 공식 분석 도구인 analyse 사용법을 확인해본다.

```json
// package.json
{
  "scripts": {
    ...
    "analysis": "webpack --profile --json > stats.json",
    ...
  },
}
```

먼저 analyse 분석 도구를 사용하기 전, webpack 통계 데이터를 추출한다.

<img src="https://github.com/user-attachments/assets/2a4fce7a-b8e8-4fdb-8305-9470fe9f947a" />

그 다음 [analyse](https://webpack.github.io/analyse/) 링크에 들어가서 통계 데이터를 업로드하면된다.

메뉴는 Home, Modules, Chunks, Assets, Warnings, Erros, Hints로 구성되어있고, 메뉴마다 모듈 크기 의존도 등을 확인할 수 있다.

## 📚 기술 스택

### 🔧 환경

<span>
  <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white">
</span>

### 🌏 언어

<span>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
</span>

### 🧰 개발도구

<span>
  <img src="https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black">
</span>

### 🎸 기타

<span>
  <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">
  <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">
</span>
