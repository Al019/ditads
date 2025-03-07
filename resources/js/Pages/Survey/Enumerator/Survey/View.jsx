import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { usePage } from "@inertiajs/react"
import axios from "axios"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from "@/Components/ui/button"

const tabs = ["Questions", "Responses"]

const View = () => {
  const { survey_id } = usePage().props
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [survey, setSurvey] = useState([])
  const [answer, setAnswer] = useState([])

  useEffect(() => {
    getSurvey()
  }, [])

  const getSurvey = async () => {
    axios.get(route('api.enumerator.survey.view', { survey_id }))
      .then(({ data }) => {
        setSurvey(data);
      })
  }

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_${survey.id}`)
    if (savedAnswers) {
      setAnswer(JSON.parse(savedAnswers))
    }
  }, [survey])

  const handleAnswerChange = (questionId, optionId) => {
    setAnswer((prev) => {
      const question = survey.question.find((q) => q.id === questionId)
      const option = question.option.find((opt) => opt.id === optionId)

      const updatedAnswers = prev.filter((item) => item.questionId !== questionId)
      const newAnswers = [
        ...updatedAnswers,
        {
          questionId,
          text: option.text,
          option: [{ optionId: option.id }],
        },
      ]

      localStorage.setItem(`answers_${survey.id}`, JSON.stringify(newAnswers))
      return newAnswers
    })
  }

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswer((prev) => {
      let updatedAnswers = [...prev]
      let existing = updatedAnswers.find((item) => item.questionId === questionId)

      if (!existing) {
        existing = { questionId, option: [], text: [] }
        updatedAnswers.push(existing)
      }

      if (checked) {
        existing.option.push({ optionId: option.id })
        existing.text.push(option.text)
      } else {
        existing.option = existing.option.filter((opt) => opt.optionId !== option.id)
        existing.text = existing.text.filter((text) => text !== option.text)
      }

      if (existing.option.length === 0) {
        updatedAnswers = updatedAnswers.filter((item) => item.questionId !== questionId)
      }

      localStorage.setItem(`answers_${survey.id}`, JSON.stringify(updatedAnswers))
      return updatedAnswers
    })
  }

  const handleInputChange = (questionId, option, value) => {
    setAnswer((prev) => {
      const updatedAnswers = prev.filter((item) => item.questionId !== questionId)

      if (value.trim() !== "") {
        const newAnswers = [
          ...updatedAnswers,
          {
            questionId,
            text: value,
            option: [{ optionId: option.id }],
          },
        ]
        localStorage.setItem(`answers_${survey.id}`, JSON.stringify(newAnswers))
        return newAnswers
      } else {
        localStorage.setItem(`answers_${survey.id}`, JSON.stringify(updatedAnswers))
        return updatedAnswers
      }
    })
  }

  return (
    <Tabs defaultValue={activeTab}>
      <AuthenticatedLayout title={survey.title} button={
        activeTab === 'Questions' && (
          <Button>
            Submit
          </Button>
        )
      } tab={
        <div className="flex justify-center mb-2">
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      }>
        <TabsContent value="Questions">
          <div className="max-w-[800px] mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {survey.title}
                </CardTitle>
              </CardHeader>
              {survey.description && (
                <CardContent>
                  <CardDescription>
                    {survey.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
            {survey.question?.map((question, qIndex) => (
              <Card key={qIndex}>
                <CardHeader>
                  <CardDescription className="text-xs">Question {qIndex + 1} {question.required === 1 && <span className="text-destructive text-sm">*</span>}</CardDescription>
                  <CardTitle>
                    {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === 'radio' && (
                    <RadioGroup onValueChange={(val) => handleAnswerChange(question.id, val)}>
                      <div className="grid grid-cols-2 gap-4">
                        {question.option?.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-2">
                            <RadioGroupItem checked={answer.some(
                              (ans) =>
                                ans.questionId === question.id &&
                                ans.option.some((opt) => opt.optionId === option.id)
                            )} value={option.id} id={`radio-${oIndex}`} />
                            <Label htmlFor={`radio-${oIndex}`}>{option.text}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                  {question.type === 'checkbox' && (
                    <div className="grid grid-cols-2 gap-4">
                      {question.option?.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-2">
                          <Checkbox checked={answer.some(
                            (ans) =>
                              ans.questionId === question.id &&
                              ans.option.some((opt) => opt.optionId === option.id)
                          )} onCheckedChange={(val) => handleCheckboxChange(question.id, option, val)} id={`checkbox-${oIndex}`} />
                          <Label htmlFor={`checkbox-${oIndex}`}>{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                  {question.type === 'select' && (
                    <div className="grid grid-cols-2">
                      <Select value={answer.find(ans => ans.questionId === question.id)?.option[0].optionId} onValueChange={(val) => handleAnswerChange(question.id, val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {question.option?.map((option, oIndex) => (
                              <SelectItem key={oIndex} value={option.id}>{option.text}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {question.type === 'input' && (
                    <Textarea value={answer.find(ans => ans.questionId === question.id)?.text} onChange={(e) => handleInputChange(question.id, question.option[0], e.target.value)} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default View