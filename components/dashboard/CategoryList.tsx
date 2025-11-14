'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DeleteCategoryButton from './DeleteCategoryButton'

interface Category {
  id: string
  name: string
  order: number
}

interface CategoryListProps {
  categories: Category[]
  restaurantId: string
}

function SortableCategoryRow({ category }: { category: Category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{category.order}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Link href={`/dashboard/menu-categories/${category.id}/edit`}>
            <Button variant="ghost" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <DeleteCategoryButton categoryId={category.id} />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function CategoryList({
  categories: initialCategories,
  restaurantId,
}: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isReordering, setIsReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id)
      const newIndex = categories.findIndex((c) => c.id === over.id)

      const newCategories = arrayMove(categories, oldIndex, newIndex)
      setCategories(newCategories)
      setIsReordering(true)

      // Update order values
      const updates = newCategories.map((cat, index) => ({
        id: cat.id,
        order: index,
      }))

      try {
        const response = await fetch('/api/menu-categories/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: updates }),
        })

        if (!response.ok) {
          throw new Error('Sıralama güncellenemedi')
        }
      } catch (error) {
        console.error('Reorder error:', error)
        // Revert on error
        setCategories(initialCategories)
        alert('Sıralama güncellenirken bir hata oluştu')
      } finally {
        setIsReordering(false)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Sıra</TableHead>
            <TableHead>Kategori Adı</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <SortableCategoryRow key={category.id} category={category} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}

