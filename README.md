# Learn Hanyu — Flashcard tiếng Trung

Web app học flashcard tiếng Trung cá nhân, chạy hoàn toàn trên trình duyệt. Không cần backend hay database — dữ liệu từ vựng nằm trong file JSON, tiến độ học lưu bằng LocalStorage.

## Tính năng

- **Flashcard** với hiệu ứng lật card (mặt trước: Hanzi, mặt sau: đầy đủ thông tin)
- **Navigation**: Previous, Next, Random, Flip + phím tắt `←` `→` `Space` `R`
- **Chế độ sắp xếp**: Random (weighted), mới/cũ, priority, chưa học, cần ôn lại
- **Random thông minh**: từ priority cao xuất hiện thường xuyên hơn
- **Tìm kiếm** theo Hanzi, Pinyin, nghĩa tiếng Việt
- **Filter tag**: work, design, daily, food, ...
- **Thống kê** + progress bar
- **Spaced repetition** đơn giản với nút "Đã nhớ" / "Khó nhớ"
- **Import/Export JSON**
- **Phát âm** tiếng Trung (Web Speech API)
- **Yêu thích** (favorite)
- **Mobile swipe** trái/phải để đổi card
- **Bonus**: Heatmap lịch sử học, Quiz mode, Autoplay, biểu đồ thống kê

## Cấu trúc thư mục

```
Learn_hanyu/
├── data/
│   └── words.json          # Dữ liệu từ vựng (chỉnh sửa tại đây)
├── src/
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   ├── utils/              # Logic: storage, sorting, random, SRS
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Chạy local

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## Build production

```bash
npm run build
npm run preview
```

## Deploy lên GitHub Pages

> **Lỗi thường gặp:** `Failed to load /src/main.jsx (404)`  
> Nghĩa là GitHub Pages đang serve **source code** thay vì **bản build** (`dist/`).  
> File `index.html` gốc có `/src/main.jsx` — chỉ dùng khi dev local. Sau build, script trỏ tới `/Learn_hanyu/assets/index-xxx.js`.

### Cách 1: GitHub Actions (khuyến nghị)

1. Push code lên GitHub repo `Learn_hanyu`
2. Vào **Settings → Pages → Build and deployment**
3. **Source** phải là **GitHub Actions** (KHÔNG chọn "Deploy from a branch" → main)
4. Push lên `main` — workflow tự `npm run build` rồi deploy thư mục `dist/`
5. Mở site tại: `https://<username>.github.io/Learn_hanyu/`

Nếu vừa đổi source, vào tab **Actions** → chạy lại workflow **Deploy to GitHub Pages** (Run workflow).

### Cách 2: Deploy thủ công bằng gh-pages

```bash
npm run deploy
```

Lệnh này build với `--base /Learn_hanyu/` rồi push thư mục `dist/` lên branch `gh-pages`.

Sau đó vào **Settings → Pages** → chọn branch **`gh-pages`** / **`/ (root)`**.

### Lưu ý base path

- Repo project (`username.github.io/Learn_hanyu`): base = `/Learn_hanyu/` (đã cấu hình sẵn trong CI)
- User page (`username.github.io`): đổi `VITE_BASE` thành `/` trong workflow
- Local dev: `npm run dev` dùng `base: './'` — không ảnh hưởng

## Thêm từ vựng mới

Chỉnh file `data/words.json`. Mỗi từ là một object:

```json
{
  "id": 11,
  "hanzi": "电脑",
  "pinyin": "diànnǎo",
  "meaning": "máy tính",
  "examples": [
    {
      "zh": "我的电脑很快。",
      "py": "Wǒ de diànnǎo hěn kuài.",
      "vi": "Máy tính của tôi rất nhanh."
    }
  ],
  "priority": 4,
  "createdAt": "2026-05-31",
  "lastReviewed": null,
  "reviewCount": 0,
  "tags": ["work", "daily"]
}
```

### Giải thích các trường

| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| `id` | Có | ID duy nhất (số nguyên) |
| `hanzi` | Có | Chữ Hán |
| `pinyin` | Có | Phiên âm (có dấu thanh) |
| `meaning` | Có | Nghĩa tiếng Việt |
| `examples` | Không | Mảng ví dụ `{ zh, py, vi }` — `py` là phiên âm câu ví dụ |
| `priority` | Có | 1 (ít gặp) → 5 (hay gặp) |
| `createdAt` | Có | Ngày thêm, format `YYYY-MM-DD` |
| `lastReviewed` | Không | Ngày ôn gần nhất hoặc `null` |
| `reviewCount` | Không | Số lần đã xem (mặc định 0) |
| `tags` | Không | Mảng tag để filter |

Sau khi sửa JSON, chạy lại `npm run dev` hoặc `npm run build`.

> **Lưu ý**: Tiến độ học (`reviewCount`, `lastReviewed`, `priority` điều chỉnh, favorite) được lưu riêng trong LocalStorage. Import/Export JSON sẽ gộp cả tiến độ hiện tại.

## Phím tắt

| Phím | Hành động |
|------|-----------|
| `←` | Từ trước |
| `→` | Từ tiếp |
| `Space` | Lật card |
| `R` | Random |

## Mobile

- Vuốt **trái** → từ tiếp
- Vuốt **phải** → từ trước

## Công nghệ

- React 19 + Vite 6
- HTML/CSS thuần (không UI framework)
- LocalStorage cho state
- Web Speech API cho phát âm

## License

MIT — dùng tự do cho mục đích cá nhân.
