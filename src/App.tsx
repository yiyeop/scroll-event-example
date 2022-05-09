import { Fragment, useEffect, useMemo, useState } from 'react';
import { useScroll } from './hooks';
import menus from './data.json';
import { groupBy } from 'lodash';

const groups = groupBy(menus, 'menuGroup');

const TARGET_TOP_POSITION = 80;

function App() {
  const scroll = useScroll();

  const fixedTop = useMemo(() => {
    return TARGET_TOP_POSITION - scroll.y > 0 ? Math.round(TARGET_TOP_POSITION - scroll.y) : 0;
  }, [scroll.y]);

  const ratio = useMemo(() => {
    return fixedTop / TARGET_TOP_POSITION;
  }, [fixedTop]);

  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    const elements = document.querySelectorAll('div[data-target-index]');
    const result = Array.from(elements).map((element) => (element as HTMLElement).offsetTop);
    setPositions(result);
  }, []);

  return (
    <>
      <div className='min-h-screen relative'>
        <div className='w-full h-[180px] bg-gray-200' />
        <div
          style={{
            width: `calc(100% - ${ratio * 50}px)`,
            top: `${fixedTop}px`,
            left: `${ratio * 25 > 0 ? ratio * 25 : 0}px`,
          }}
          className='border border-gray-400 flex justify-center items-center
          bg-white h-[60px] px-5 w-full fixed top-[80px]'
        >
          <i className='fas fa-angle-left text-[24px] mr-auto' style={{ opacity: 1 - ratio * 1 }} />

          <div
            className='font-bold'
            style={{
              fontSize: `${ratio * 1.5 > 1 ? ratio * 1.5 : 1}rem`,
            }}
          >
            가게 이름
          </div>

          <i className='fas fa-shopping-cart ml-auto' style={{ opacity: 1 - ratio * 1 }} />
        </div>

        {/* 메뉴 그룹 */}

        <div className='sticky top-[60px] bg-white flex items-center space-x-4 px-5 border-b border-b-grey-500'>
          {Object.keys(groups).map((group, index) => (
            <div
              key={index}
              onClick={() => window.scrollTo(0, positions?.[index])}
              className={
                positions?.[index] < scroll.y + 120 && (positions?.[index + 1] ?? 9999) > scroll.y + 120
                  ? 'p-2 border-b-2 border-b-black font-bold'
                  : 'p-2'
              }
            >
              {group}
            </div>
          ))}
        </div>

        {/* 메뉴 목록 */}

        {Object.entries(groups).map(([groupName, group], index) => (
          <Fragment key={index}>
            <div className='p-5 font-bold bg-gray-100' data-target-index={index}>
              {groupName}
            </div>
            {group.map((menu, index) => (
              <div key={index} className='border-b border-b-grey-500 p-5 flex-row items-center'>
                <div>
                  <b>{menu.name}</b>
                  <div>{menu.price}원</div>
                </div>
                <div className='w-20 h-20 rounded-[8px] bg-gray-200 ml-auto' />
              </div>
            ))}
          </Fragment>
        ))}

        <div className='h-[150vh] bg-white' />
      </div>
    </>
  );
}

export default App;
