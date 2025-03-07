import { Button } from "@/Components/ui/button"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/Components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/Components/ui/input"
import { ChevronDown, Circle, CirclePlus, Loader2, Square, Text, Trash2, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { createRef, forwardRef, useEffect, useRef, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { router } from "@inertiajs/react"
import { Separator } from "@/Components/ui/separator"

const tabs = ["Questions", "Settings"]

const Create = () => {
  const [selected, setSelected] = useState(1)
  const questionRefs = useRef([])
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [processing, setProcessing] = useState(false)

  const [survey, setSurvey] = useState(() => {
    const savedSurvey = localStorage.getItem("create-survey")
    return savedSurvey ? JSON.parse(savedSurvey) : {
      title: "Untitled Form",
      description: "",
      questions: [
        {
          text: "Untitled Question",
          type: "radio",
          required: 0,
          options: [
            {
              text: "Question option"
            }
          ]
        }
      ],
    }
  })

  useEffect(() => {
    localStorage.setItem("create-survey", JSON.stringify(survey))
  }, [survey])

  const handleChangeHeader = (field, value) => {
    setSurvey({ ...survey, [field]: value })
  }

  const handleChangeQuestion = (qIndex, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[qIndex][field] = value;

    if (value === 'input') {
      updatedQuestions[qIndex].options = [{ text: 'Text' }];
    } else if (['radio', 'checkbox', 'select'].includes(value)) {
      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(option => ({
        ...option,
        text: 'Question option',
      }))
    }

    setSurvey({
      ...survey,
      questions: updatedQuestions,
    })
  }

  const handleChangeOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options[oIndex].text = value
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      text: "Untitled question",
      type: "radio",
      required: 0,
      options: [
        {
          text: "Question option"
        }
      ]
    }

    setSurvey(prevSurvey => {
      const updatedQuestions = [...prevSurvey.questions]
      const insertIndex = selected === 0 ? 0 : selected
      updatedQuestions.splice(insertIndex, 0, newQuestion)

      setTimeout(() => {
        setSelected(insertIndex + 1)
        questionRefs.current[insertIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)

      return { ...prevSurvey, questions: updatedQuestions }
    })
  }

  const handleRemoveQuestion = (qIndex) => {
    setSurvey((prev) => {
      const updatedQuestions = prev.questions.filter((_, index) => index !== qIndex)

      let newSelected = selected

      if (updatedQuestions.length === 0) {
        newSelected = 0
      } else if (selected === qIndex + 1) {
        newSelected = qIndex === 0 ? 1 : qIndex
      } else if (selected > qIndex + 1) {
        newSelected -= 1
      }

      setTimeout(() => {
        setSelected(newSelected)
        if (newSelected > 0) {
          questionRefs.current[newSelected - 1]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)

      return { ...prev, questions: updatedQuestions }
    })
  }

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.push({ text: "Question option" })
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[qIndex].options.splice(oIndex, 1)
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleToggleRequired = (checked) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => ({ ...q, required: checked ? 1 : 0 })),
    }))
  }

  const handlePublish = async () => {
    setProcessing(true)
    await axios.post(route('api.admin.survey.publish'), survey)
      .then(() => {
        router.visit(route('admin.survey'))
        toast.success("Survey created successfully.")
        localStorage.removeItem("create-survey")
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Failed to submit response. Please try again.")
        } else if (error.request) {
          toast.error("Network error. Please check your connection.")
        } else {
          toast.error("An unexpected error occurred. Please try again.")
        }
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  return (
    <Tabs defaultValue={activeTab}>
      <AuthenticatedLayout title={survey.title} button={
        activeTab === "Questions" && (
          <Button onClick={handlePublish} disabled={processing}>
            <Loader2 className={`animate-spin ${!processing ? 'hidden' : ''}`} />
            Publish
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
          <div className="max-w-[800px] mx-auto space-y-4 mb-40">
            <Card onClick={() => setSelected(0)} className={selected === 0 ? 'ring-2 ring-green-500' : ''}>
              <CardHeader>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Textarea value={survey.title} onChange={(e) => handleChangeHeader("title", e.target.value)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea value={survey.description} onChange={(e) => handleChangeHeader("description", e.target.value)} placeholder="Optional" />
                </div>
              </CardContent>
            </Card>
            {survey.questions.map((question, qIndex) => (
              <Card key={qIndex} ref={el => questionRefs.current[qIndex] = el} onClick={() => setSelected(qIndex + 1)} className={selected === qIndex + 1 ? 'ring-2 ring-green-500' : ''}>
                <CardHeader>
                  <div className="space-y-1">
                    <Label>Question {qIndex + 1}</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Textarea value={question.text} onChange={(e) => handleChangeQuestion(qIndex, "text", e.target.value)} />
                      </div>
                      <div className="w-[200px]">
                        <Select value={question.type} onValueChange={(val) => handleChangeQuestion(qIndex, "type", val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="radio">Multiple choice</SelectItem>
                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="input">Open ended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="space-y-2">
                        <div className={`flex gap-4 ${question.type === 'input' ? 'items-center' : 'items-end'}`}>
                          <div>
                            <Button variant="text" size="icon" className="cursor-default">
                              {
                                question.type === 'radio' ? <Circle /> :
                                  question.type === 'checkbox' ? <Square /> :
                                    question.type === 'select' ? <ChevronDown /> :
                                      <Text />
                              }
                            </Button>
                          </div>
                          <div className="space-y-1 flex-1">
                            {question.type !== 'input' && (
                              <Label>Option {oIndex + 1}</Label>
                            )}
                            {question.type === 'input' ? (
                              <Label>{option.text}</Label>
                            ) : (
                              <Input value={option.text} onChange={(e) => handleChangeOption(qIndex, oIndex, e.target.value)} />
                            )}
                          </div>
                          {question.type !== 'input' && (
                            <div>
                              <Button onClick={() => handleRemoveOption(qIndex, oIndex)} variant="secondary" size="icon">
                                <X />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {question.type !== 'input' && (
                      <Button onClick={() => handleAddOption(qIndex)} variant="outline">
                        Add option
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="flex justify-end items-center gap-4">
                      <div>
                        <Button onClick={() => handleRemoveQuestion(qIndex)} variant="secondary" size="icon">
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="required" checked={question.required === 1} value={question.required === 1 ? 0 : 1} onCheckedChange={(val) => handleChangeQuestion(qIndex, "required", val ? 1 : 0)} />
                        <Label htmlFor="required">Required</Label>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="sticky bottom-4 max-w-[800px] mx-auto">
            <Card>
              <div className="flex justify-center p-4">
                <Button onClick={handleAddQuestion} variant="outline" size="icon">
                  <CirclePlus />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="Settings">
          <div className="max-w-[800px] mx-auto space-y-4">
            <Card>
              <CardHeader>
                <h1 className="font-medium">Manage Survey</h1>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h1 className="font-normal text-sm">Required</h1>
                    <p className="text-xs font-normal">All questions are required.</p>
                  </div>
                  <Switch checked={survey.questions.every(q => q.required === 1)} onCheckedChange={(val) => handleToggleRequired(val)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default Create