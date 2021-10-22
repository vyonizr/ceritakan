import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import MoonLoader from 'react-spinners/MoonLoader'
import { ACTIONS, LIFECYCLE } from 'react-joyride'

import { QuestionCard, BackCard, Footer, EmptyResult } from 'src/components/'
import { Question } from 'src/common/types'
import {
  TOUR_STEPS,
  CARD_FLIP_DURATION,
  CARD_FLIP_DEGREE,
  CARD_MAX_ROTATE_DEGREE,
  CARD_MIN_ROTATE_DEGREE,
  ERROR_MESSAGE,
  LIGHT,
  DARK,
} from 'src/common/constants'
import { getRandomIntInclusive, getRandomFloat } from 'src/helpers'
import { REGEX_COMMA_SEPARATED_NUMBER } from 'src/helpers/regex'
import { ProductTourTooltip, IntroductionModal } from 'src/components'

const initialDegree = getRandomFloat(
  CARD_MIN_ROTATE_DEGREE,
  CARD_MAX_ROTATE_DEGREE
)

const Home = () => {
  const { theme, setTheme } = useTheme()
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [questionFetch, setQuestionFetch] = useState({
    isLoading: false,
    data: {
      id: 1,
      question: '',
    } as Question,
    error: '',
  })
  const [rotateDegree, setRotateDegree] = useState(
    getRandomIntInclusive(CARD_MIN_ROTATE_DEGREE, CARD_MAX_ROTATE_DEGREE)
  )
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false)

  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)

  useEffect(() => {
    if (
      localStorage.theme === DARK ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add(DARK)
    } else {
      document.documentElement.classList.remove(DARK)
    }

    const readQuestionIds: string | null = localStorage.getItem('r_ids')
    const isReadIdsNotValid =
      readQuestionIds && !REGEX_COMMA_SEPARATED_NUMBER.test(readQuestionIds)

    if (isReadIdsNotValid) {
      localStorage.removeItem('r_ids')
    }

    if (isProductTourNotCompleted()) {
      setIsIntroModalOpen(true)
    }

    setRun(isProductTourNotCompleted())
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

  const isProductTourNotCompleted = () => {
    return localStorage.getItem('pt') !== '1'
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
        CARD_MIN_ROTATE_DEGREE,
        CARD_MAX_ROTATE_DEGREE
      )

      while (newRotateDegree === rotateDegree) {
        newRotateDegree = getRandomIntInclusive(
          CARD_MIN_ROTATE_DEGREE,
          CARD_MAX_ROTATE_DEGREE
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

  const getNewCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.tagName !== 'A') {
      if (stepIndex === 1 && isProductTourNotCompleted()) {
        // Product tour is done
        localStorage.setItem('pt', '1')
      }

      toggleCard()
      if (isOpen) {
        handleQuestionFetch()
      }
    }
  }

  const startOver = () => {
    localStorage.removeItem('r_ids')
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
      setRun(false)
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

  const restartProductTour = () => {
    localStorage.removeItem('pt')
    Router.reload()
  }

  const RestartModal = () => {
    return (
      <div className='absolute flex-col w-screen h-screen custom-flex-center dark:text-black'>
        <div className='z-20 flex-col w-64 p-3 rounded-md custom-flex-center bg-gray-50'>
          <h2 className='mb-4 text-lg text-center'>
            Apakah kamu ingin mengulangi tutorial?
          </h2>
          <div className='grid grid-cols-2 w-max gap-x-5'>
            <button
              className='px-5 py-3 font-medium rounded-lg'
              onClick={() => setIsRestartModalOpen(false)}
            >
              <span>Tidak</span>
            </button>
            <button
              className='px-5 py-3 font-medium text-white rounded-lg bg-primary'
              onClick={restartProductTour}
            >
              <span className='text-white'>Ulangi</span>
            </button>
          </div>
        </div>
        <div className='absolute z-10 w-screen h-screen bg-gray-900 opacity-80' />
      </div>
    )
  }

  return (
    <div className='container grid items-center h-screen grid-rows-2 home-grid justify-items-center'>
      <Head>
        <title>Ceritakan</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      {isRestartModalOpen && <RestartModal />}
      {isIntroModalOpen && (
        <IntroductionModal onClose={() => setIsIntroModalOpen(false)} />
      )}

      {isCardEmpty() ? (
        <div className='relative'>
          <EmptyResult startOver={startOver} />
        </div>
      ) : (
        <div>
          <div className='grid justify-end grid-flow-col mb-5 auto-cols-max gap-x-3 w-72'>
            <button
              aria-label='Toggle Dark Mode'
              type='button'
              onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
              className='text-3xl cursor-pointer'
            >
              {theme === DARK ? '☀️' : '🌙'}
            </button>
            <img
              title='Mulai ulang tutorial'
              className='inline-block cursor-pointer'
              src='/icons/info-icon.svg'
              alt='Restart product tour icon'
              onClick={() => setIsRestartModalOpen(true)}
            />
          </div>
          <div className='relative self-center cursor-pointer items card-dimension tour-open-card'>
            <div className='absolute' onClick={toggleCard}>
              <motion.div
                className='relative backface-invisible'
                initial={{
                  rotateY: isOpen ? CARD_FLIP_DEGREE : 0,
                  rotate: initialDegree,
                }}
                animate={{
                  rotateY: isOpen ? CARD_FLIP_DEGREE : 0,
                  rotate: rotateDegree,
                }}
                transition={{ duration: CARD_FLIP_DURATION }}
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
            <div
              className='absolute'
              onClick={(event: any) => getNewCard(event)}
            >
              <motion.div
                className='relative backface-invisible'
                initial={{
                  rotateY: isOpen ? 0 : CARD_FLIP_DEGREE,
                  rotate: initialDegree,
                }}
                animate={{
                  rotateY: isOpen ? 0 : CARD_FLIP_DEGREE,
                  rotate: rotateDegree,
                }}
                transition={{ duration: CARD_FLIP_DURATION }}
              >
                <QuestionCard question={questionFetch.data} />
              </motion.div>
            </div>
          </div>
          <motion.p
            className={`self-end mt-12 text-center pointer-events-${
              isOpen ? 'none' : 'auto'
            }`}
            initial={{ opacity: isOpen ? 1 : 0 }}
            exit={{ opacity: isOpen ? 0 : 1 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={isOpen ? '#' : '/submit'}>
              <a
                className={`text-lg font-bold no-underline select-none text-primary ${
                  isOpen && 'cursor-default select-none'
                }`}
              >
                Kirim pertanyaan
              </a>
            </Link>
          </motion.p>
        </div>
      )}

      <div className='grid h-full'>
        <div className='self-end mb-6'>
          <Footer />
        </div>
      </div>
      <ProductTourTooltip
        callback={handleJoyrideCallback}
        steps={TOUR_STEPS}
        run={run}
        stepIndex={stepIndex}
      />
    </div>
  )
}

export default Home
