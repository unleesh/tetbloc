# 블록 퍼즐 게임

HTML5 기반 블록 맞추기 퍼즐 게임입니다. Next.js와 TypeScript로 구현되었습니다.

## 게임 방식

1. 위쪽 보드에 표시된 패턴을 완성하는 것이 목표입니다
2. 아래쪽에 있는 블록 조각들을 드래그 앤 드롭으로 보드에 배치합니다
3. 모든 조각을 올바르게 배치하면 레벨이 완성됩니다
4. 레벨이 진행될수록 난이도가 높아집니다

## 주요 기능

- ✅ 드래그 앤 드롭 인터페이스
- ✅ 레벨별 난이도 증가
- ✅ 실시간 타이머
- ✅ 조각 교체 기능 (배치된 조각 클릭)
- ✅ 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 게임을 플레이할 수 있습니다.

## 프로젝트 구조

```
block-puzzle-game/
├── app/
│   ├── page.tsx          # 메인 게임 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── globals.css       # 전역 스타일
├── components/
│   ├── GameBoard.tsx     # 게임 보드 컴포넌트
│   └── PieceSelector.tsx # 조각 선택 컴포넌트
├── data/
│   └── patterns.ts       # 레벨별 패턴 데이터
├── types/
│   └── game.ts           # 타입 정의
└── package.json
```

## 커스터마이징

### 새 레벨 추가

`data/patterns.ts` 파일에서 `LEVEL_PATTERNS` 배열에 새로운 패턴을 추가할 수 있습니다:

```typescript
{
  id: 4,
  level: 4,
  gridSize: { rows: 10, cols: 10 },
  targetCells: [
    // 채워야 할 셀 좌표
    { row: 2, col: 3 },
    // ...
  ],
  pieces: [
    // 사용할 조각들
    {
      id: 'p4-1',
      shape: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        // ...
      ],
      color: '#8B4513',
      position: { row: 0, col: 0 },
    },
  ],
}
```

### 셀 크기 조정

`components/GameBoard.tsx`와 `components/PieceSelector.tsx`의 `CELL_SIZE` 상수를 수정하여 블록 크기를 조정할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## 향후 개선 사항

- [ ] 블록 회전 기능
- [ ] 힌트 시스템
- [ ] 점수 및 랭킹 시스템
- [ ] 더 많은 레벨
- [ ] 사운드 효과
- [ ] 애니메이션 효과
- [ ] 모바일 터치 최적화
