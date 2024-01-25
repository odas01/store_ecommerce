import { Col, Row, Spin } from 'antd';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import Sort from '@/layouts/home/components/Sort';
import Filter from '@/layouts/home/components/Filter';
import ProductCard from '@/components/ProductCard';

import { IProduct } from '@/types';
import { store } from '@/constants';
import { categoryApi, productApi } from '@/api';
import { PageTitle } from '@/components';

export interface Filter {
   category: string;
   size: string[];
   color: string[];
}

type Store = (typeof store)[number];

const Shop = () => {
   const [sort, setSort] = useState<string>('');
   const [filter, setFilter] = useState<Partial<Filter>>({});

   const params = useParams();
   const { t, i18n } = useTranslation(['home', 'mutual', 'dashboard']);

   const [title, setTitle] = useState<string>('');

   const isVn = i18n.language === 'vi';
   const categoriesQuery = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
         categoryApi.getAll({
            skip: 0,
            limit: 100,
         }),
   });

   const { data, hasNextPage, fetchNextPage, isLoading, isFetching } =
      useInfiniteQuery({
         queryKey: ['products', params, sort, filter],
         queryFn: ({ pageParam = 0 }) => {
            return productApi.getAll({
               skip: pageParam * 6,
               limit: 6,
               sort,
               status: 'show',
               ...filter,
               ...params,
            });
         },
         getNextPageParam: ({ page, lastPage }) => {
            if (page < lastPage) {
               return page;
            }
         },
         staleTime: 0,
         keepPreviousData: true,
      });

   useEffect(() => {
      const foundCate = categoriesQuery.data?.categories.find((item) => {
         if (params.category) {
            return item.name === params.category;
         }
         return item.store === params.store;
      });

      if (foundCate) {
         if (params.category) {
            setTitle(isVn ? foundCate?.vnName : foundCate?.name);
         } else {
            setTitle(t(`store.${foundCate.store as Store}`, { ns: 'mutual' }));
         }
      }
      if (!params.store) {
         setTitle(t('allProducts'));
      }
   }, [params, data, isVn]);

   const products = data?.pages.reduce(
      (cur, item) => [...cur, ...item.products],
      [] as IProduct[]
   );
   console.log(data);

   return (
      <>
         <PageTitle title='Category' />
         <div className='bg-[#f5f5f5] py-2 text-13'>
            <div className='container space-x-2'>
               <Link to='/'>{t('home.home')}</Link>
               <span className='text-[#ccc]'>/</span>
               <Link to='/shop'>{t('label.category', { ns: 'mutual' })}</Link>
               <span className='text-[#ccc]'>/</span>
               <span className='capitalize text-[#777]'>{title}</span>
            </div>
         </div>
         <div className='container pt-8'>
            {isLoading ? (
               <div className='flex justify-center'>
                  <Spin size='large' />
               </div>
            ) : (
               <div className='space-y-6'>
                  <Row gutter={24}>
                     <Col span={5} className='relative pt-4'>
                        <div className='sticky pr-4 top-4'>
                           <Filter setFilter={setFilter} />
                        </div>
                     </Col>
                     <Col span={19} className='relative'>
                        <div className='space-y-4'>
                           <div className='sticky flex items-center justify-between -top-[1px] py-3 z-[100] bg-white '>
                              {/* <TitleShop qty={data?.pages[0].total!} /> */}
                              <h2 className='text-xl font-medium capitalize'>
                                 {title} ({data?.pages[0].total})
                              </h2>

                              <div
                                 className={twMerge(
                                    !products?.length &&
                                       'cursor-not-allowed pointer-events-none'
                                 )}
                              >
                                 <Sort {...{ sort, setSort }} />
                              </div>
                           </div>
                           {products?.length ? (
                              <InfiniteScroll
                                 className='!overflow-visible relative'
                                 dataLength={products?.length || 0} //This is important field to render the next data
                                 next={() => fetchNextPage()}
                                 hasMore={hasNextPage || false}
                                 loader={<></>}
                              >
                                 <Row gutter={[12, 32]}>
                                    {products?.map((item, index) => (
                                       <Col span={8} key={index}>
                                          <ProductCard data={item} />
                                       </Col>
                                    ))}
                                    {isFetching && (
                                       <div className='absolute w-full h-full bg-[rgba(255,255,255,0.54)] z-[101]' />
                                    )}
                                 </Row>
                              </InfiniteScroll>
                           ) : (
                              <h2 className='text-2xl text-center uppercase'>
                                 {t('noProductsMatch')}
                              </h2>
                           )}
                        </div>
                     </Col>
                  </Row>
               </div>
            )}
         </div>
      </>
   );
};

export default Shop;
