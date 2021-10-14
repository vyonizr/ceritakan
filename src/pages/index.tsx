import { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import MoonLoader from 'react-spinners/MoonLoader'

import QuestionCard from 'src/components/QuestionCard'
import BackCard from 'src/components/BackCard'
import Footer from 'src/components/Footer'
import EmptyResult from 'src/components/EmptyResult'
import { Question } from 'src/common/types'

const FLIP_DURATION = 0.5
const FLIP_DEGREE = 180
const ERROR_MESSAGE = 'Ada yang salah nih. Coba di-refresh, ya.'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [questionFetch, setQuestionFetch] = useState({
    isLoading: false,
    data: {} as Question,
    error: '',
  })

  useEffect(() => {
    handleQuestionFetch()
  }, [])

  const handleReadIds = (questionId: number) => {
    const readQuestionIds: string = localStorage.getItem('r_ids') || ''
    if (readQuestionIds.length > 0) {
      localStorage.setItem('r_ids', readQuestionIds + ',' + String(questionId))
    } else {
      localStorage.setItem('r_ids', String(questionId))
    }
  }

  const toggleCard = () => {
    if (!questionFetch.isLoading) {
      setIsOpen((state) => !state)
    }
  }

  const handleQuestionFetch = () => {
    setQuestionFetch((state) => ({
      ...state,
      isLoading: true,
    }))

    setTimeout(() => {
      fetchQuestion()
    }, 1000)
  }

  const getNewCard = () => {
    toggleCard()
    if (isOpen) {
      handleQuestionFetch()
    }
  }

  const startOver = () => {
    localStorage.setItem('r_ids', '')
    handleQuestionFetch()
  }

  const fetchQuestion = async () => {
    try {
      const r_ids: string = localStorage.getItem('r_ids') || ''
      const respone = await fetch(`/api/questions/random?r_ids=${r_ids}`)
      const responseJSON = await respone.json()
      handleReadIds(responseJSON.data.id)

      setQuestionFetch({
        isLoading: false,
        data: responseJSON.data,
        error: '',
      })
    } catch (error) {
      setQuestionFetch({
        isLoading: false,
        data: {} as Question,
        error: ERROR_MESSAGE,
      })
    }
  }

  const isCardReady = () => {
    return !questionFetch.isLoading && !isOpen
  }

  const isCardEmpty = () => {
    return (
      Object.keys(questionFetch.data).length === 0 && !questionFetch.isLoading
    )
  }

  return (
    <div className='container grid grid-rows-3 h-screen justify-items-center items-center'>
      <Head>
        <title>Ceritakan</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
        <meta
          name='description'
          content='Ceritakan adalah sebuah platform pertanyaan terbuka'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {isCardEmpty() ? (
        <div className='relative row-span-2'>
          <EmptyResult startOver={startOver} />
        </div>
      ) : (
        <div className='relative row-span-2 card-dimension'>
          <div className='absolute cursor-pointer' onClick={toggleCard}>
            <motion.div
              className='relative backface-invisible'
              initial={{ rotateY: isOpen ? FLIP_DEGREE : 0 }}
              animate={{ rotateY: isOpen ? FLIP_DEGREE : 0 }}
              transition={{ duration: FLIP_DURATION }}
            >
              <div className='absolute w-full h-full flex justify-center items-end pb-9'>
                {isCardReady() ? (
                  <button className='sonar'></button>
                ) : (
                  <MoonLoader
                    color='#fff'
                    loading={questionFetch.isLoading}
                    size={40}
                  />
                )}
              </div>
              <BackCard />
            </motion.div>
          </div>
          <div className='absolute cursor-pointer' onClick={getNewCard}>
            <motion.div
              className='relative backface-invisible cursor-pointer'
              initial={{ rotateY: isOpen ? 0 : FLIP_DEGREE }}
              animate={{ rotateY: isOpen ? 0 : FLIP_DEGREE }}
              transition={{ duration: FLIP_DURATION }}
            >
              <QuestionCard question={questionFetch.data} />
            </motion.div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Home
