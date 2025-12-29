import React from 'react';
import { useState, useEffect } from 'react';

import Pause from './assets/Pause';

import style from './Timer.module.css';

function Timer() {
	const [time, setTime] = useState(60 * 25);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(prevCount => prevCount - 1);
		}, 1000);

		return () => { clearInterval(intervalId); };
	},
	[]);

	return (
		<div className={style.page}>
			<div className={style.head}>
				연우의 개발공장
				<div className={style.right}>
					<div className={style.btn}>
						<div>오늘의 습관 &gt;</div>
					</div>
					<div className={style.btn}>
						<div>홈 &gt;</div>
					</div>
				</div>
			</div>

			<div className= {style.info}>
				현재까지 획득한 포인트
				<div className={style.points}>
					310P 획득
				</div>
			</div>

			<div id={style.bottom}>
				<div className={style.concentrate_today}>
					오늘의 집중
				</div>

				<div className={style.clock_top}>

					<div className={style.clock_image}> 이미지

					</div>
					<div className={style.num_text}>25:00
					</div>
				</div>
				<div className={style.watch_num}>
					{(() => {
						let m = (time - (time % 60)) / 60;
						let s = time % 60;

						return `${m}:${s}`;
					})()}
				</div>

				<div className={style.btn_sum}>
					<div onClick={() => { }}>b</div>
				</div>
			</div>
		</div>
	);
}

export default Timer;
