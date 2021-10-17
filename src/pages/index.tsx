import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import MoonLoader from 'react-spinners/MoonLoader'

import QuestionCard from 'src/components/QuestionCard'
import BackCard from 'src/components/BackCard'
import Footer from 'src/components/Footer'
import EmptyResult from 'src/components/EmptyResult'
import { Question } from 'src/common/types'
import { TOUR_STEPS } from 'src/common/constants'
import { ACTIONS, LIFECYCLE } from 'react-joyride'
import { getRandomIntInclusive, getRandomFloat } from 'src/helpers'

const FLIP_DURATION = 0.5
const FLIP_DEGREE = 180
const MAX_ROTATE_DEGREE = 1
const MIN_ROTATE_DEGREE = 0 - MAX_ROTATE_DEGREE
const ERROR_MESSAGE = 'Ada yang salah nih. Coba di-refresh, ya.'

const Joyride = dynamic(() => import('react-joyride'), { ssr: false })
const initialDegree = getRandomFloat(MIN_ROTATE_DEGREE, MAX_ROTATE_DEGREE)

const Home = () => {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [questionFetch, setQuestionFetch] = useState({
    isLoading: false,
    data: {} as Question,
    error: '',
  })
  const [rotateDegree, setRotateDegree] = useState(
    getRandomIntInclusive(MIN_ROTATE_DEGREE, MAX_ROTATE_DEGREE)
  )

  useEffect(() => {
    setRun(isProductTourNotCompleted())
    handleQuestionFetch()
  }, [])

  const isProductTourNotCompleted = () => {
    return localStorage.getItem('pt') !== '1'
  }

  const handleReadIds = (questionId: number) => {
    const readQuestionIds: string = localStorage.getItem('r_ids') || ''
    if (readQuestionIds.length > 0) {
      localStorage.setItem('r_ids', readQuestionIds + ',' + String(questionId))
    } else {
      localStorage.setItem('r_ids', String(questionId))
    }
  }

  const handleJoyrideCallback = (data: any) => {
    const { action, index, lifecycle } = data

    const isFirstStepDone =
      index === 0 &&
      action === ACTIONS.CLOSE &&
      lifecycle === LIFECYCLE.COMPLETE

    if (isFirstStepDone) {
      setRun(false)
    }
  }

  const toggleCard = () => {
    if (!questionFetch.isLoading) {
      let newRotateDegree = getRandomIntInclusive(
        MIN_ROTATE_DEGREE,
        MAX_ROTATE_DEGREE
      )

      while (newRotateDegree === rotateDegree) {
        newRotateDegree = getRandomIntInclusive(
          MIN_ROTATE_DEGREE,
          MAX_ROTATE_DEGREE
        )
      }

      setRotateDegree(newRotateDegree)
      setIsOpen((state) => !state)
      setStepIndex((state) => state + 1)
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
    if (stepIndex === 1 && isProductTourNotCompleted()) {
      // Product tour is done
      localStorage.setItem('pt', '1')
    }

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
      const response = await fetch(`/api/questions/random?r_ids=${r_ids}`)
      const responseJSON = await response.json()
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
    <div className='container grid items-center h-screen grid-rows-3 justify-items-center'>
      <Head>
        <title>Ceritakan</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
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
        <div className='relative row-span-2 card-dimension tour-open-card'>
          <div className='absolute cursor-pointer' onClick={toggleCard}>
            <motion.div
              className='relative backface-invisible'
              initial={{
                rotateY: isOpen ? FLIP_DEGREE : 0,
                rotate: initialDegree,
              }}
              animate={{
                rotateY: isOpen ? FLIP_DEGREE : 0,
                rotate: rotateDegree,
              }}
              transition={{ duration: FLIP_DURATION }}
            >
              <div className='absolute flex items-end justify-center w-full h-full pb-9'>
                {isCardReady() ? (
                  <button aria-label={'Open card'} className='sonar'></button>
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
              className='relative cursor-pointer backface-invisible'
              initial={{
                rotateY: isOpen ? 0 : FLIP_DEGREE,
                rotate: initialDegree,
              }}
              animate={{
                rotateY: isOpen ? 0 : FLIP_DEGREE,
                rotate: rotateDegree,
              }}
              transition={{ duration: FLIP_DURATION }}
            >
              <QuestionCard question={questionFetch.data} />
            </motion.div>
          </div>
        </div>
      )}
      <Footer />
      <Joyride
        callback={handleJoyrideCallback}
        steps={TOUR_STEPS}
        run={run}
        stepIndex={stepIndex}
        styles={{
          options: { primaryColor: '#3B82F6' },
          buttonNext: {
            display: 'none',
          },
        }}
        disableOverlay
        hideBackButton
        disableCloseOnEsc
      />
    </div>
  )
}

export default Home
