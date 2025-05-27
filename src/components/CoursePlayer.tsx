// components/CoursePlayer.tsx
import VideoPlayer from './VideoPlayer'
import type { Course } from '../types'  // define Course based on courses.json

export default function CoursePlayer({ course }: { course: Course }) {
  return (
    <div className="space-y-10">
      {course.sections.map((sec, idx) => (
        <section key={idx} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">{sec.title}</h3>
          <div className="space-y-8">
            {sec.videos.map(video => (
              <div key={video.muxPlaybackId}>
                <h4 className="text-xl font-medium mb-2">
                  {video.title} <span className="text-gray-500 text-sm">({video.duration})</span>
                </h4>
                <VideoPlayer playbackId={video.muxPlaybackId} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
