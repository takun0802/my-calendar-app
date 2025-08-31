import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(""); // ← カテゴリ絞り込み用

  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    category: "仕事",
    date: "",
    dayOfWeek: "",
    time: "",
    location: "",
    person: "",
    memo: "",
    priority: 1,
  });

  // 全イベント取得
  useEffect(() => {
    fetch("https://18.179.45.80:32775/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  // 曜日自動設定
  useEffect(() => {
    if (formData.date) {
      const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
      const dayOfWeek = dayNames[new Date(formData.date).getDay()];
      setFormData((prev) => ({ ...prev, dayOfWeek }));
    }
  }, [formData.date]);

  // 入力変更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // カテゴリ選択変更
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // 登録
  const handleSubmit = (e) => {
    e.preventDefault();

    const eventToSend = {
      ...formData,
      time:
        formData.date && formData.time
          ? formData.date + "T" + formData.time
          : null,
    };

    fetch("https://18.179.45.80:32775/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error("登録失敗");
        return res.json();
      })
      .then((newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
        alert("登録成功！");
        setFormData({
          userId: "",
          title: "",
          category: "仕事",
          date: "",
          dayOfWeek: "",
          time: "",
          location: "",
          person: "",
          memo: "",
          priority: 1,
        });
      })
      .catch((e) => alert(e.message));
  };

  // 日付＋カテゴリによるイベント絞り込み
  const filteredEvents = events.filter((event) => {
    const eventDateOnly = event.date?.split("T")[0];
    const selectedDateOnly = selectedDate.toISOString().split("T")[0];
    const isSameDate = eventDateOnly === selectedDateOnly;
    const isSameCategory =
      selectedCategory === "" || event.category === selectedCategory;
    return isSameDate && isSameCategory;
  });

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>イベントカレンダー</h1>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <h2>{selectedDate.toDateString()} のイベント</h2>

      <div>
        <label>カテゴリで絞り込み：</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">すべて</option>
          <option value="仕事">仕事</option>
          <option value="プライベート">プライベート</option>
          {/* 必要に応じてカテゴリ追加 */}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p>表示するイベントがありません</p>
      ) : (
        <ul>
          {filteredEvents.map((event) => (
            <li key={event.id}>
              {event.title}（{event.date}{" "}
              {event.time ? event.time.substring(11, 16) : ""}）
            </li>
          ))}
        </ul>
      )}

      <h2>イベント登録</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザーID2：</label>
          <input
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>タイトル：</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>カテゴリ：</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="仕事">仕事</option>
            <option value="プライベート">プライベート</option>
          </select>
        </div>
        <div>
          <label>日付：</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>時間：</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>場所：</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>相手：</label>
          <input
            name="person"
            value={formData.person}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>メモ：</label>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>優先度：</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value={1}>低</option>
            <option value={2}>中</option>
            <option value={3}>高</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          登録
        </button>
      </form>
    </div>
  );
}

export default App;
