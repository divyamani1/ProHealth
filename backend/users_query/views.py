from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import TokenAuthentication

from . models import UserQuery, Medicine, Appointment, File
from . serializer import UserQuerySerializer, AppointmentSerializer, MedicineSerializer, FileSerializer
from . permissions import IsDoctorUser, QueryPermission, PrescriptionPermission, AppointmentPermission, QPermission
from user_profile.models import User
from notifications.models import Notification



class UserQueryView(APIView):
    serializer_class = UserQuerySerializer

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, QPermission )
    @staticmethod
    def get(request):
        user = request.user
        query = UserQuery.objects.filter(user=user)
        return Response(UserQuerySerializer(query, many=True).data)

    @staticmethod
    def post(request):
        serializer = UserQuerySerializer(data=request.data, context = {'request':request})
        if serializer.is_valid():
            user = request.user
            serializer.save(user=user)

            # for notification
            title = request.user.first_name + " " + request.user.last_name + " has asked you a question."
            message = request.data.get('title_problem')
            users = User.objects.filter(is_doctor=True, doctorprofile__speciality=request.data['tag'])
            query_id = serializer.data['id']
            query = get_object_or_404(UserQuery, id=query_id)
            for doc_user in users:
                notification = Notification(user=doc_user, query=query, title=title, message=message)
                notification.save()

            return Response(UserQuerySerializer(serializer.instance).data, status=201)
        return Response(serializer.errors, status=400)


class FindQueryView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsDoctorUser,)
    
    @staticmethod
    def get(request):
        query = UserQuery.objects.filter(taken=False)
        return Response(UserQuerySerializer(query, many=True).data)


class TakenQueryView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsDoctorUser,)
    
    @staticmethod
    def get(request):
        user=request.user
        query = UserQuery.objects.filter(taken_by=user)
        return Response(UserQuerySerializer(query, many=True).data)
        

class UserQueryDetailView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,QueryPermission,)

    @staticmethod
    def get(request, query_id):
        queri = get_object_or_404(UserQuery, pk=query_id)
        return Response(UserQuerySerializer(queri).data)

    @staticmethod
    def patch(request, query_id):
        queri = get_object_or_404(UserQuery, pk=query_id)
        serializer = UserQuerySerializer(queri, data=request.data, context={'request':request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserQuerySerializer(serializer.instance).data)
        return Response(serializer.errors, status=404)
    
    @staticmethod
    def delete(request, query_id):
        queri = get_object_or_404(UserQuery, pk=query_id)
        if queri.user != request.user:
            return Response(status=401)#unauthorized
        queri.delete()
        return Response(status=204)#no content


class AppointmentView(APIView):
    serializer_class = AppointmentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, AppointmentPermission,)

    @staticmethod
    def get(request, query_id,**kwargs):

        query = get_object_or_404(UserQuery, pk=query_id)
        appoint = get_object_or_404(Appointment,query=query)
        return Response(AppointmentSerializer(appoint).data)
    
    @staticmethod
    def post(request, query_id):
        query = get_object_or_404(UserQuery,pk=query_id)
        serializer = AppointmentSerializer(data=request.data, context = {'request':request})
        if serializer.is_valid():
            user = request.user
            serializer.save(query=query)

            # for notification
            user = request.user
            title = user.first_name + " " + user.last_name + " just created an appointment with you."
            message = query.title_problem
            notification = Notification(user=query.user, query=query, title=title, message=message)
            notification.save()

            return Response(AppointmentSerializer(serializer.instance).data, status=201)
        return Response(serializer.errors, status=400)


class AppointmentDetailView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, AppointmentPermission,)
    @staticmethod
    def get(request, query_id, **kwargs):
        query = get_object_or_404(UserQuery,pk=query_id)
        appoint = get_object_or_404(Appointment, query=query)
        return Response(AppointmentSerializer(appoint).data)

    @staticmethod
    def patch(request, query_id, **kwargs):
        query = get_object_or_404(UserQuery, pk=query_id)
        appoint = get_object_or_404(Appointment, query=query)
        serializer = AppointmentSerializer(appoint, data=request.data, context={'request':request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(AppointmentSerializer(serializer.instance).data)
        return Response(serializer.errors, status=400)

    @staticmethod
    def delete(request, query_id, **kwargs):
        query = get_object_or_404(UserQuery, pk=query_id)
        appoint = get_object_or_404(Appointment, query=query)
        if query.taken_by != request.user:
            return Response(status=401)#unauthorized
        appoint.delete()
        return Response(status=204)#no content
        

class PrescribeView(APIView):
    serializer_class = MedicineSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, PrescriptionPermission,)

    @staticmethod
    def get(request, query_id):
        query = get_object_or_404(UserQuery,pk=query_id)
        prescribe =Medicine.objects.filter(query=query)
        return Response(MedicineSerializer(prescribe, many=True).data)

    @staticmethod
    def post(request, query_id):
        user = request.user
        query = get_object_or_404(UserQuery, pk=query_id)
        serializer = MedicineSerializer(data=request.data, context = {'request':request})
        if serializer.is_valid(): #and user== query.taken_by:
            serializer.save(query=query)
        # else:
        #     return Response(401)

            # for notification
            user = request.user
            title = user.first_name + " " + user.last_name + " prescribed you."
            message = query.title_problem
            notification = Notification(user=query.user, query=query, title=title, message=message)
            notification.save()

            return Response(MedicineSerializer(serializer.instance).data, status=201)
        return Response(serializer.errors, status=400)
        


class PrescribeDetailView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, PrescriptionPermission,)
    @staticmethod
    def get(request, query_id, prescribe_id):
        prescribe =get_object_or_404(Medicine, pk=prescribe_id)
        return Response(MedicineSerializer(prescribe).data)

    @staticmethod
    def delete(request, query_id, prescribe_id):
        query = get_object_or_404(UserQuery, pk=query_id)
        prescribe = Medicine.objects.filter(pk=prescribe_id)
        # if query.user != request.user:
        #     return Response(status=401)#unauthorized
        prescribe.delete()
        return Response(status=204)#no content


class FileView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, QueryPermission,)
    @staticmethod
    def get(request,query_id):
        query = get_object_or_404(UserQuery, pk=query_id)
        files = File.objects.filter(query=query)
        return Response(FileSerializer(files, many=True).data)
    
    @staticmethod
    def post(request, query_id):
        query = get_object_or_404(UserQuery, pk = query_id)
        serializer = FileSerializer(data = request.data, context={'request':request})
        if serializer.is_valid():
            serializer.save(query=query)
            return Response(FileSerializer(serializer.instance).data, status=201)
        return Response(serializer.errors, status=400)

class FileDetailView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, QueryPermission,)
    @staticmethod
    def get(request, query_id, files_id):
        files = get_object_or_404(File, pk=files_id)
        return Response(FileSerializer(files).data)
    
    @staticmethod
    def delete(request, query_id, files_id):
        query = get_object_or_404(UserQuery, pk = query_id)
        files = File.objects.filter(pk=files_id)
        if query.user != request.user:
            return Response(status=401)
        files.delete()
        return Response(status=204)


class TakenView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsDoctorUser, )
    @staticmethod
    def post(request, query_id):
        query = UserQuery.objects.get(pk=query_id)
        user = request.user
        if user.is_doctor and query.taken==False:
            query.taken = True
            query.taken_by = user
            query.save()
            return Response(status=200)
        else:
            return Response(status=401)

class ResolveView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, QueryPermission)
    @staticmethod
    def post(request, query_id):
        query = UserQuery.objects.get(pk=query_id)
        user = request.user
        if user==query.user and query.resolved==False:
            query.resolved = True
            query.save()
            return Response(status=200)
        else:
            return Response(status=401)

class SearchApiView(APIView):
    serializer_class = UserQuerySerializer
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):
        if 'q' in request.GET:
            querystring = request.GET.get('q').strip()
            if len(querystring) == 0:
                return Response('empty')
            results = {'query': UserQuery.objects.none()}
            queries = querystring.split()
            for query in queries:
                results['query'] = results['query'] | UserQuery.objects.filter(
                    Q(title_problem__icontains=query) | Q(description__icontains=query) | Q(name_of_patient__icontains=query))
        return Response(UserQuerySerializer(results['query'], many=True).data)


# class FindQueryDetailView(APIView):
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (IsAuthenticated, IsDoctorUser,)

#     @staticmethod
#     def get(request, query_id):
#         queri = get_object_or_404(UserQuery, pk=query_id)
#         return Response(UserQuerySerializer(queri).data)
