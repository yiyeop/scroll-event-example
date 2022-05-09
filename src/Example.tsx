import { Fragment, useEffect, useMemo, useState } from 'react';
import { useScroll } from './hooks';
import menus from './data.json';
import { groupBy } from 'lodash';

const groups = groupBy(menus, 'menuGroup');

const TARGET_TOP_POSITION = 80;

function Example() {
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
    const result = Array.from(elements).map((el) => (el as HTMLElement).offsetTop);

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
          fixed bg-white h-[60px] px-5'
        >
          <i className='fas fa-angle-left text-[24px] mr-auto' style={{ opacity: 1 - ratio * 1 }} />

          <div
            className='font-bold'
            style={{
              fontSize: `${ratio * 1.5 > 1 ? ratio * 1.5 : 1}rem`,
            }}
          >
            Store Name
          </div>

          <i className='fas fa-shopping-cart ml-auto' style={{ opacity: 1 - ratio * 1 }} />
        </div>

        <div className='sticky top-[60px] bg-white flex items-center space-x-4 px-5 border-b border-b-grey-500'>
          {Object.keys(groups).map((group, index) => (
            <div
              key={index}
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

        {Object.entries(groups).map(([groupName, group], index) => (
          <Fragment key={index}>
            <div className='p-5 font-bold bg-gray-100' data-target-index={index}>
              {groupName}
            </div>
            {group.map((menu, index) => (
              <div key={index} className='border-b border-b-grey-500 p-5'>
                {menu.name}
              </div>
            ))}
          </Fragment>
        ))}

        <div className='h-[150vh] bg-white' />
      </div>
    </>
  );
}

export default Example;
