import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getAllTopics, updateTopicStatus } from '../api/topics';

export default function Topics() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const { data: topics = [], isLoading, isError } = useQuery({
    queryKey: ['getTopics'],
    queryFn: getAllTopics,
  });
  const queryClient = useQueryClient();
  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const mutation = useMutation({
    mutationFn: updateTopicStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTopics'] });
    },
    onError: (err) => {
      console.error('Error updating subtopic:', err);
    },
  });

  const handleCheckboxChange = (subTopic: any, checked: boolean, topicId: string) => {
    const newStatus = checked ? 'DONE' : 'PENDING';
    mutation.mutate({
      topicId,
      subTopicName: subTopic.name,
      status: newStatus,
    });
  };

  if (isLoading) return <p>Loading topics...</p>;
  if (isError) return <p>Error loading topics</p>;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600">Topics</h2>
          <p className="text-gray-600">Explore these exciting topics!</p>
        </div>

        <div className="space-y-4">
          {topics.map((topic: any) => (
            <div key={topic._id} className="rounded-lg overflow-hidden">
              <button
                className="w-full bg-cyan-500 text-white p-4 flex justify-between items-center"
                onClick={() => toggleSection(topic._id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{topic.topic}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${topic.overAllStatus === 'DONE' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {topic.overAllStatus.charAt(0).toUpperCase() + topic.overAllStatus.slice(1).toLowerCase()}
                  </span>
                </div>
                {expandedSections[topic._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expandedSections[topic._id] && (
                <div className="bg-gray-100 p-4">
                  <h3 className="text-xl font-bold mb-4">Sub Topics</h3>
                  {topic.subTopics?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="p-3 text-left"></th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-center">LeetCode Link</th>
                            <th className="p-3 text-center">YouTube Link</th>
                            <th className="p-3 text-center">Article Link</th>
                            <th className="p-3 text-center">Level</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topic.subTopics.map((sub: any, idx: number) => (
                            <tr key={idx} className="border-b">
                              <td className="p-3">
                                <input type="checkbox" className="h-4 w-4" checked={sub.status === 'DONE'}
                                  onChange={(e) =>
                                    handleCheckboxChange(sub, e.target.checked, topic._id)
                                  }
                                />
                              </td>
                              <td className="p-3">{sub.name}</td>
                              <td className="p-3 text-center">
                                <a href={sub.leetCodeLink} target="_blank" className="text-blue-500 hover:underline">Practise</a>
                              </td>
                              <td className="p-3 text-center">
                                <a href={sub.youTubeLink} target="_blank" className="text-blue-500 hover:underline">Watch</a>
                              </td>
                              <td className="p-3 text-center">
                                <a href={sub.articleLink} target="_blank" className="text-blue-500 hover:underline">Read</a>
                              </td>
                              <td className="p-3 text-center">{sub.level.charAt(0).toUpperCase() + sub.level.slice(1).toLowerCase()}</td>
                              <td className="p-3 text-center">{sub.status.charAt(0).toUpperCase() + sub.status.slice(1).toLowerCase()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No subtopics available.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
